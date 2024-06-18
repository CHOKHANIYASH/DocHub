const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
const { response } = require("express");
const prisma = new PrismaClient();
const create = async ({ authorId, docId }) => {
  const newDocument = await prisma.docs.create({
    data: {
      authorId,
      docId,
    },
  });
  return {
    status: 201,
    response: {
      success: true,
      message: "Document created Successfully",
      data: { docId },
    },
  };
};
const getDoument = async (docId) => {
  const document = await prisma.findUnique({
    where: {
      docId,
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
module.exports = { create, getDoument };
