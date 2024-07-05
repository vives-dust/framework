FROM python:alpine
WORKDIR /usr/src/app
COPY * ./
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Run the script
CMD [ "python", "-u", "script.py" ]