# A Probe wrapper class containing the different sensors of a Sensoterra probe
from dataclasses import dataclass

@dataclass
class Parameter:
    height: str
    value: float
    unit: str
    timestamp: str = ""
    type: str = "temperature"

class Probe:
    def __init__(self, name, location, id):
        self.name = name
        self.location = location
        self.id = id
        self.parameters = []

    def processMeasurement(self, data):
        for measurement in data:
            parameter = Parameter(measurement["height"], measurement["value"], measurement["unit"], measurement["timestamp"])
            if parameter.unit == "%":
                parameter.type = "soil_moisture"
            self.parameters.append(parameter)

    def clearParameters(self):
        self.parameters = []
