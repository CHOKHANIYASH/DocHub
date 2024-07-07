const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
const prisma = new PrismaClient();
const signup = async ({
  userId,
  username,
  email,
  firstName,
  lastName,
  avatar,
}) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: userId }, { username }, { email }],
    },
  });
  if (user) throw new AppError("User Already Exists", 400);
  const newUser = await prisma.user.create({
    data: {
      id: userId,
      username,
      email,
      firstName,
      lastName,
      avatar,
    },
  });
  return {
    status: 201,
    response: {
      status: "success",
      message: "User created successfully",
      data: newUser,
    },
  };
};
const allUsers = async () => {
  const users = await prisma.user.findMany();
  return {
    status: 200,
    response: { success: true, message: "all users", data: users },
  };
};

module.exports = { signup, allUsers };
