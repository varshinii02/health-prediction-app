from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'

db = SQLAlchemy(app)

# Patient Table
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100))
    dob = db.Column(db.String(20))
    email = db.Column(db.String(100))

    glucose = db.Column(db.Float)
    haemoglobin = db.Column(db.Float)
    cholesterol = db.Column(db.Float)

    remarks = db.Column(db.String(200))


# AI Prediction Function
def predict(glucose, haemoglobin, cholesterol):

    if glucose > 140:
        return "High Risk of Diabetes"

    elif cholesterol > 240:
        return "High Cholesterol Risk"

    elif haemoglobin < 12:
        return "Possible Anemia"

    else:
        return "Normal"


# CREATE
@app.route('/patients', methods=['POST'])
def add_patient():

    data = request.json

    remarks = predict(
        data['glucose'],
        data['haemoglobin'],
        data['cholesterol']
    )

    patient = Patient(
        full_name=data['full_name'],
        dob=data['dob'],
        email=data['email'],
        glucose=data['glucose'],
        haemoglobin=data['haemoglobin'],
        cholesterol=data['cholesterol'],
        remarks=remarks
    )

    db.session.add(patient)
    db.session.commit()

    return jsonify({
        "message": "Patient Added Successfully",
        "remarks": remarks
    })


# READ
@app.route('/patients', methods=['GET'])
def get_patients():

    patients = Patient.query.all()

    result = []

    for p in patients:
        result.append({
            "id": p.id,
            "full_name": p.full_name,
            "dob": p.dob,
            "email": p.email,
            "glucose": p.glucose,
            "haemoglobin": p.haemoglobin,
            "cholesterol": p.cholesterol,
            "remarks": p.remarks
        })

    return jsonify(result)


# UPDATE
@app.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):

    patient = Patient.query.get(id)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    data = request.json

    patient.full_name = data['full_name']
    patient.dob = data['dob']
    patient.email = data['email']
    patient.glucose = data['glucose']
    patient.haemoglobin = data['haemoglobin']
    patient.cholesterol = data['cholesterol']

    patient.remarks = predict(
        data['glucose'],
        data['haemoglobin'],
        data['cholesterol']
    )

    db.session.commit()

    return jsonify({"message": "Patient Updated Successfully"})


# DELETE
@app.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):

    patient = Patient.query.get(id)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    db.session.delete(patient)
    db.session.commit()

    return jsonify({"message": "Patient Deleted Successfully"})


@app.route('/')
def home():
    return "Backend Running"


# Create Database Tables
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True)