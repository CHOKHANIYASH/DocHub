const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
const { response } = require("express");
const prisma = new PrismaClient();
const create = async ({ authorId, docId }) => {
  const newDocument = await prisma.docs
    .create({
      data: {
        authorId,
        id: docId,
      },
    })
    .catch((err) => {
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
const getAllDocuments = async ({ authorId }) => {
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
    return { id: document.id, name: document.name };
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
const updateDocumentJson = async ({ docId, json }) => {
  const document = await prisma.docs
    .update({
      where: {
        id: docId,
      },
      data: {
        document: json,
      },
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
    response: { success: true, message: "Json saved successfully", data: {} },
  };
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
module.exports = {
  create,
  getAllDocuments,
  getDoument,
  updateDocument,
  updateDocumentJson,
};
