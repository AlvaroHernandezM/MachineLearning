import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3 as VisualRecognition

from watson_developer_cloud import VisualRecognitionV3 as VisualRecognition
#31e589a7ae4990a6261e68d8b2931acf5145b973 - alvaro - junto
#37ff1e95c9da3f5e5161d6f49b0139469c087f8d . watsonR - separados
visual_recognition = VisualRecognition('2016-05-20', api_key='31e589a7ae4990a6261e68d8b2931acf5145b973')

with open(join(dirname(__file__), 'positive_todas.zip'), 'rb') as carne_uptc, \
	 open(join(dirname(__file__), 'negative_arregladas.zip'), 'rb') as carne_otro:
   print(json.dumps(visual_recognition.create_classifier('carne_uptc', completo_positive_examples=carne_uptc, negative_examples=carne_otro), indent=2))
   
#with open(join(dirname(__file__), 'positive_arregladas.zip'), 'rb') as carne_completo, \
#	 open(join(dirname(__file__), 'positive_arregladas.zip'), 'rb') as carne_cortado, \
 #    open(join(dirname(__file__), 'negative_arregladas.zip'), 'rb') as carne_otro:
  # print(json.dumps(visual_recognition.create_classifier('CarnesUPTCvsCarnesOtros', completo_positive_examples=carne_completo, cortado_positive_examples=carne_cortado, negative_examples=carne_otro), indent=2))