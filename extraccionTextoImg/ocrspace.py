import requests
import json
from pprint import pprint
def ocr_space_file(filename, overlay=False, api_key='0bdd98696888957', language='spa'):
    """ OCR.space API request with local file.
        Python3.5 - not tested on 2.7
    :param filename: Your file path & name.
    :param overlay: Is OCR.space overlay required in your response.
                    Defaults to False.
    :param api_key: OCR.space API key.
                    Defaults to 'helloworld'.
    :param language: Language code to be used in OCR.
                    List of available language codes can be found on https://ocr.space/OCRAPI
                    Defaults to 'en'.
    :return: Result in JSON format.
    """

    payload = {'isOverlayRequired': overlay,
               'apikey': api_key,
               'language': language,
               }
    with open(filename, 'rb') as f:
        r = requests.post('https://api.ocr.space/parse/image',
                          files={filename: f},
                          data=payload,
                          )
    return r.content.decode('utf-8')

# Use examples:
test_file = ocr_space_file(filename='example2.jpg', language='spa')
data = json.loads(test_file)
#pprint (data)
if data["IsErroredOnProcessing"]==True:
  print 'Ha ocurrido un error al extraer el texto de este carnet:'
  print data["ParsedResults"][0]["ErrorMessage"]
else:
  print 'Texto extraido correctamente:'
  print data["ParsedResults"][0]["ParsedText"].split()
  print 'Tiempo: '+data["ProcessingTimeInMilliseconds"]+' ms'