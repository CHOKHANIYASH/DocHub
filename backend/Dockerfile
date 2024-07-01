# Download the imaga of latest version of nodejs
FROM node:latest 
#(optional) setting the work directory with the container, here it is '/app'
WORKDIR /app
# Copy package.json to the container (by default to the working directory(if set)), '.' specifies the current directory
# same as COPY server /app
COPY ./server/package.json .
RUN npm install
# we copied package.json json seperately because docker caches everything,we do not want the npm install
# to run again and again every time we do changes to our source code we want docker to use the cached node_modules and copy 
# our source code only again, this is a kind of optimization technique.
COPY ./server/prisma ./prisma
RUN npx prisma generate
COPY ./server .
EXPOSE  5000
CMD ["node","./src/app.js"]
