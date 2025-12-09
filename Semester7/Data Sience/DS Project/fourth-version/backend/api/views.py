from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import os
from django.conf import settings
from .ml.feature_extractor import FeatureExtractor
from .ml.models import PacketClassifier

# Initialize models once (or lazy load)
classifier = PacketClassifier()

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        upload_dir = os.path.join(settings.BASE_DIR, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file_obj.name)
        
        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        # Process file
        extractor = FeatureExtractor(file_path)
        if extractor.load_packets():
            features = extractor.extract_features()
        else:
            # Fallback for demo if pcap is invalid or empty
            features = extractor.get_dummy_features()

        # Predict
        predictions = classifier.predict(features)
        
        # Get readable class names
        cnn_class = classifier.get_class_name(predictions['cnn']['class'])
        xgb_class = classifier.get_class_name(predictions['xgboost']['class'])

        # Cleanup
        try:
            os.remove(file_path)
        except:
            pass

        return Response({
            "features": features, # Contains protocol_counts, class_counts, etc.
            "predictions": {
                "cnn": {
                    "class_id": predictions['cnn']['class'],
                    "class_name": cnn_class,
                    "confidence": predictions['cnn']['confidence']
                },
                "xgboost": {
                    "class_id": predictions['xgboost']['class'],
                    "class_name": xgb_class
                },
                "isolation_forest": predictions['isolation_forest']
            },
            # Explicitly expose stats for convenience if frontend needs them at root level
            "statistics": {
                "protocol_counts": features.get('protocol_counts', {}),
                "class_counts": features.get('class_counts', {})
            }
        }, status=status.HTTP_200_OK)

class StatsView(APIView):
    def get(self, request):
        # Return dummy stats for the dashboard
        # These should match the 5 classes we defined
        return Response({
            "model_accuracies": {
                "cnn": 0.95,
                "xgboost": 0.97,
                "isolation_forest": 0.90
            },
            "class_distribution": {
                "Class A (Web)": 45,
                "Class B (Streaming)": 20,
                "Class C (File Transfer)": 15,
                "Class D (Messaging)": 10,
                "Class E (System)": 10
            },
            "recent_activity": [
                 {"time": "10:00", "packets": 1200, "attack_detected": False},
                 {"time": "10:05", "packets": 1500, "attack_detected": False},
                 {"time": "10:10", "packets": 800, "attack_detected": True},
            ]
        })
