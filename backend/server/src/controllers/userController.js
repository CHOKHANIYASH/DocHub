const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middleware/middleware");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
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

const updateUser = async ({ userId, user }) => {
  const updatedUser = await prisma.user
    .update({
      where: {
        id: userId,
      },
      data: user,
    })
    .catch((err) => {
      if (err.code === "P2025") {
        // P2025 Prisma error code
        throw new AppError("User not found", 404);
      } else throw new AppError("Invalid input field", 400);
    });
  return {
    status: 200,
    response: {
      success: true,
      message: "User Updated successfully",
      data: updatedUser,
    },
  };
};

const deleteUser = async ({ userId }) => {
  const deletedUser = await prisma.user
    .delete({
      where: {
        id: userId,
      },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        // P2025 Prisma error code
        throw new AppError("User not found", 404);
      } else throw err;
    });
  return {
    status: 200,
    response: {
      success: true,
      message: "User deleted successfully",
      data: {},
    },
  };
};
const userVerifier = async ({ accessToken }) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
  });
  try {
    const payload = await verifier.verify(
      accessToken // the JWT as string
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { signup, allUsers, updateUser, deleteUser, userVerifier };
