import httplib, urllib, base64
import json
from pprint import pprint

headers = {
    # Request headers
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': '7c955f15783a4000afdd117635ae6b19',
}

params = urllib.urlencode({
    # Request parameters
    'language': 'es',
    'detectOrientation ': 'true',
})

try:
    img = open('example2.jpg', 'rb').read()
    conn = httplib.HTTPSConnection('api.projectoxford.ai')
    conn.request("POST", "/vision/v1.0/ocr?%s" % params, img, headers)
    response = conn.getresponse()
    data = response.read()
    #print(data)
    data = json.loads(data)
    for i in data['regions'][0]['lines']:
        for j in i['words']:
            print j['text']
        #if(len(i['words'])>0):
        #    pprint(i['words'][0])
        #else:
        #   pprint(i['words'])
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

