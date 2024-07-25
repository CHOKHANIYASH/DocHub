const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
const { userVerifier } = require("./userController");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const getAllDocuments = async ({ authorId }) => {
  // if user not present it sends an empty array, it does throw error for user not present
  const response = await prisma.docs
    .findMany({
      where: {
        authorId,
      },
    })
    .catch((err) => {
      throw new AppError("User not found", 404);
    });
  const documents = response.map((document) => {
    return {
      id: document.id,
      name: document.name,
      createdAt: document.createdAt,
    };
  });
  return {
    status: 200,
    response: {
      success: true,
      message: "User documents",
      data: documents,
    },
  };
};
const getDoument = async ({ docId }) => {
  const document = await prisma.docs.findUnique({
    where: {
      id: docId,
    },
    include: {
      allowedUsers: true,
    },
  });
  if (!document) throw new AppError("Document Not Found", 404);
  return {
    status: 200,
    response: {
      success: true,
      message: "Document found successfully",
      data: document,
    },
  };
};
const create = async ({ authorId }) => {
  const newDocument = await prisma.docs
    .create({
      data: {
        authorId,
      },
    })
    .catch((err) => {
      console.log(err);
      throw new AppError("User not found", 400);
    });
  return {
    status: 201,
    response: {
      success: true,
      message: "Document created Successfully",
      data: newDocument,
    },
  };
};
const isAuthorizedToView = async ({ docId, userId, email, accessToken }) => {
  const document = await prisma.docs.findUnique({
    where: {
      id: docId,
    },
    select: {
      id: true,
      authorId: true,
      accessType: true,
      allowedUsers: true,
    },
  });
  if (
    document.accessType === "public" ||
    document.accessType === "publicViewOnly"
  )
    return true;
  const verifiedUser = await userVerifier({ accessToken });
  if (!verifiedUser) return false;
  const decoded = jwt.decode(accessToken, { complete: true });
  if (!decoded) return false;
  const { sub } = decoded.payload;
  const USERID = sub;
  if (USERID !== userId) {
    return false;
  }
  if (userId === document.authorId) return true;
  for (user of document.allowedUsers) {
    if (user.email === email) return true;
  }
  return false;
};

const isAuthorizedToUpdate = async ({ docId, userId, email, accessToken }) => {
  const document = await prisma.docs.findUnique({
    where: {
      id: docId,
    },
    select: {
      id: true,
      authorId: true,
      accessType: true,
      allowedUsers: true,
    },
  });
  if (document.accessType === "public") return true;
  const verifiedUser = await userVerifier({ accessToken });
  if (!verifiedUser) return false;
  const decoded = jwt.decode(accessToken, { complete: true });
  if (!decoded) return false;
  const { sub } = decoded.payload;
  const USERID = sub;
  if (USERID !== userId) {
    return false;
  }
  if (userId === document.authorId) return true;
  for (user of document.allowedUsers) {
    if (user.email === email) {
      if (user.permission === "fullAccess") return true;
      else return false;
    }
  }
  return false;
};

const updateDocument = async ({ docId, document }) => {
  const updatedDocument = await prisma.docs
    .update({
      where: {
        id: docId,
      },
      data: document,
    })
    .catch((err) => {
      console.log(err.code);
      if (err.code === "P2025")
        // P2025 Prisma error code
        throw new AppError("Document not found", 404);
      else throw err;
    });
  return {
    status: 200,
    response: {
      success: true,
      message: "Document Updated Successfully",
      data: updatedDocument,
    },
  };
};
const updateAccessList = async ({
  docId,
  userId,
  accessType,
  allowedUsers,
}) => {
  const response = await prisma.docs.updateMany({
    where: {
      id: docId,
      authorId: userId, // Ensures that the user is the author
    },
    data: {
      accessType,
    },
  });

  if (response.count === 0) {
    throw new AppError(
      "Document not found or you do not have permission to update it",
      400
    );
  }

  await prisma.allowedUsers.deleteMany({
    where: {
      docId,
    },
  });
  console.log("update response", response);
  const type = accessType.toLowerCase();
  if (type !== "restricted") {
    return {
      status: 200,
      response: {
        success: true,
        message: "AccessList updated Successfully",
        data: {},
      },
    };
  }
  const newAllowedUsers = await Promise.all(
    allowedUsers.map(async (user) => {
      return await prisma.allowedUsers
        .create({
          data: {
            docId,
            email: user.email,
            permission: user.permission,
          },
        })
        .catch((err) => {}); // catching the unique username constraint
    })
  );

  return {
    status: 200,
    response: {
      success: true,
      message: "AccessList updated Successfully",
      data: newAllowedUsers,
    },
  };
};

const deleteDocument = async ({ docId, userId }) => {
  const response = await prisma.docs.findMany({
    where: {
      id: docId,
      authorId: userId, // Ensures that the user is the author
    },
  });

  if (response.count === 0) {
    throw new AppError(
      "Document not found or you do not have permission to delete it",
      400
    );
  }

  const deleteAllowedUsers = prisma.allowedUsers.deleteMany({
    where: {
      docId: docId,
    },
  });
  const deleteComments = prisma.comment.deleteMany({
    where: {
      docId: docId,
    },
  });
  const deleteImages = prisma.imageUrl.deleteMany({
    where: {
      docId: docId,
    },
  });
  const deleteDocument = prisma.docs.delete({
    where: {
      id: docId,
    },
  });
  const transaction = await prisma
    .$transaction([
      deleteAllowedUsers,
      deleteComments,
      deleteImages,
      deleteDocument,
    ])
    .catch((err) => {
      throw new AppError("Document not found", 404);
    });
  return {
    status: 200,
    response: {
      success: true,
      message: "Document deleted Successfully",
      data: {},
    },
  };
};
module.exports = {
  create,
  isAuthorizedToView,
  isAuthorizedToUpdate,
  getAllDocuments,
  getDoument,
  updateDocument,
  updateAccessList,
  deleteDocument,
};
