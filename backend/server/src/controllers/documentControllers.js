const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
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
      message: "Users documents",
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
  const decoded = jwt.decode(accessToken, { complete: true });
  if (!decoded) return false;
  const { sub } = decoded.payload;
  const USERID = sub;
  if (USERID !== userId) {
    return false;
  }
  if (userId === document.authorId) return true;
  console.log(document.allowedUsers);
  for (user of document.allowedUsers) {
    if (user.email === email) return true;
  }
  return false;
};

const updateDocument = async ({ docId, data }) => {
  const document = await prisma.docs
    .update({
      where: {
        id: docId,
      },
      data,
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
      data: {},
    },
  };
};
const updateAccessList = async ({ docId, accessType, allowedUsers }) => {
  const response = await prisma.docs.update({
    where: {
      id: docId,
    },
    data: {
      accessType,
    },
  });
  await prisma.allowedUsers.deleteMany({});
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
module.exports = {
  create,
  isAuthorizedToView,
  getAllDocuments,
  getDoument,
  updateDocument,
  updateAccessList,
};
