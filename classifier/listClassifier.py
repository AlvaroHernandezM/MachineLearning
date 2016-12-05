import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3 as VisualRecognition
#31e589a7ae4990a6261e68d8b2931acf5145b973 - alvaro - junto
#37ff1e95c9da3f5e5161d6f49b0139469c087f8d . watsonR - separados
visual_recognition = VisualRecognition('2016-05-20', api_key='31e589a7ae4990a6261e68d8b2931acf5145b973')
#CarnesUPTCvsCarnesOtros_1223654781 - separados
#carne_uptc_1870374799 - juntos
#print(json.dumps(visual_recognition.get_classifier('CarnesUPTCvsCarnesOtros_1223654781'), indent=2))
print(json.dumps(visual_recognition.list_classifiers(), indent=2))