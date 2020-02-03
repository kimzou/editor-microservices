FROM node:10

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

COPY wait-for-it.sh wait-for-it.sh 
RUN chmod +x wait-for-it.sh

# ENTRYPOINT [ "/bin/bash", "-c" ]
# CMD ["./wait-for-it.sh" , "gateway:4002", "--strict" , "--timeout=300" , "--" , "./wait-for-it.sh"]
