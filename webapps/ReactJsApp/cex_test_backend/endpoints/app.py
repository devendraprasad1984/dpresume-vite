from tornado import ioloop, web, httpclient, escape
import os, random, string, json


class BaseHandler(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.write("say something")

    def set_default_headers(self, *args, **kwargs):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")


class UploadHandler(BaseHandler):
    def get(self, *args, **kwargs):
        self.write("endpoint ready for app")

    def post(self, *args, **kwargs):
        try:
            file1 = self.request.files['file'][0]
            namesArr = os.path.splitext(file1['filename'])
            name = namesArr[0]
            extension = namesArr[1]
            fname = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(6))
            final_filename = name + fname + extension
            output_file = open("upload/" + final_filename, 'wb')
            output_file.write(file1['body'])
            self.finish({'status': 'success', 'msg': "file " + final_filename + " is uploaded"})
        except Exception as ex:
            self.finish({'status': 'failed', 'msg': ex})


class downloadHandler(BaseHandler):
    def get(self, *args, **kwargs):
        try:
            file_name = 'upload/dpresumebs1dac.pdf'
            buf_size = 4096
            self.set_header('Content-Type', 'application/octet-stream')
            # self.set_header('Content-Type', 'application/force-download')
            self.set_header('Content-Disposition', 'attachment; filename=' + file_name)
            with open(file_name, 'rb') as f:
                while True:
                    data = f.read(buf_size)
                    if not data:
                        break
                    self.write(data)
            self.finish({'status': 'success'})
        except Exception as ex:
            self.finish({'status': 'failed', 'msg': ex})


class jsonTest(BaseHandler):
    def initialize(self, params):
        self.params = params

    def get(self, *args, **kwargs):
        self.write({'data': 'json test', 'params': self.params, 'args': args})


class getDataFromOtherAPI(BaseHandler):
    async def get(self, *args, **kwargs):
        self.set_header('Content-Type', 'application/json')
        uri = 'https://jsonplaceholder.typicode.com/todos'
        client = httpclient.AsyncHTTPClient()
        response = await client.fetch(uri, method='GET')
        # self.write(json.dumps({'data': 'hello world'}))
        self.write(response.body)
        self.finish()

    async def post(self, *args, **kwargs):
        # self.write(kwargs.data)
        self.set_header('Content-Type', 'text/json')
        uri = 'https://jsonplaceholder.typicode.com/todos/1'
        client = httpclient.AsyncHTTPClient()
        response = await client.fetch(uri, method='POST', body=b"")
        self.finish(json.dumps({'status': 'success', 'data': 'hello'}))


class StaticFileHandler(web.StaticFileHandler):
    def parse_url_path(self, url_path):
        if not url_path or url_path.endswith('/'):
            url_path = url_path + 'index.html'
        return url_path


def mainapp(prefix=''):
    if prefix:
        path = '/' + prefix + '/(.*)'
    else:
        path = '/(.*)'
    application = web.Application([
        (r"/upload", UploadHandler),
        (r"/download", downloadHandler),
        (r"/json/(\d+)/(.*?)", jsonTest, {'params': 'object has params object'}),
        (r"/xapi", getDataFromOtherAPI),
        (path, StaticFileHandler, {'path': os.getcwd()}),
    ], debug=True)
    return application


# /usr/local/bin/python3.9 /Users/dpadmin/deven/dpgit/web/ReactJsApp/cex_test_backend/endpoints/fileUploader.py
if (__name__ == '__main__'):
    app = mainapp()
    app.listen(8888)
    io = ioloop.IOLoop.instance()
    # callback = functools.partial(connection_ready, sock)
    # io_loop.add_handler(sock.fileno(), callback, io_loop.READ)
    io.start()
