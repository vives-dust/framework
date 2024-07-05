# A Sensors class containing the different sensors of a Crodeon reporter currently supported
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum

# A Parameter is a list containing the name, value and unit of a sensor parameter
@dataclass
class Parameter:
    name: str
    value: float
    unit: str
    timestamp: str = ""

# An enum class for wind directions 
class WindDirection(Enum):
    N = 1
    NNE = 2
    NE = 3
    ENE = 4
    E = 5
    ESE = 6
    SE = 7
    SSE = 8
    S = 9
    SSW = 10
    SW = 11
    WSW = 12
    W = 13
    WNW = 14
    NW = 15
    NNW = 16

class Sensor(ABC):
    @abstractmethod
    def __init__(self, name, id, channels):
        self.name = name
        self.id = int(id)
        self.channels = channels
        self.parameters = []
    
    def __str__(self):
        return f"Sensor {self.name} with ID {self.id} has {self.channels} channels."
    
    def addParameter(self, parameter: Parameter):
        if len(self.parameters) < self.channels:
            self.parameters.append(parameter)

    def getParameterNameByChannel(self, channel):
        return self.parameters[channel].name + "_" + self.name

    def getParameterNameByParameter(self, parameter):
        pos = self.parameters.index(parameter)
        return self.parameters[pos].name + "_" + self.name

    def setParameterValue(self, channel, value, timestamp):
        self.parameters[channel].value = value
        self.parameters[channel].timestamp = timestamp

class WeatherStation(Sensor):
    def __init__(self, id):
        super().__init__("weather_station", id, 8)
        self.addParameter(Parameter("temperature", 0, "°C"))
        self.addParameter(Parameter("humidity", 0, "%"))
        self.addParameter(Parameter("wet_bulb", 0, "°C"))
        self.addParameter(Parameter("dew_point", 0, "°C"))
        self.addParameter(Parameter("average_wind_speed", 0, "m/s"))
        self.addParameter(Parameter("max_wind_speed", 0, "m/s"))
        self.addParameter(Parameter("wind_direction", 0, ""))
        self.addParameter(Parameter("rain", 0, "L/day"))
    
class ReporterInternal(Sensor):
    def __init__(self, id):
        super().__init__("reporter_internal", id, 2)
        self.addParameter(Parameter("power_supply", 0, ""))
        self.addParameter(Parameter("atmos_pressure", 0, "hPa"))

class SoilMoistureTension(Sensor):
    def __init__(self, id):
        super().__init__("soil_moisture_tension", id, 4)
        self.addParameter(Parameter("water_tension_1", 0, "kPa"))
        self.addParameter(Parameter("water_tension_2", 0, "kPa"))
        self.addParameter(Parameter("water_tension_3", 0, "kPa"))
        self.addParameter(Parameter("temperature", 0, "°C"))

class SoilMoistureVolumetric(Sensor):
    def __init__(self, id):
        super().__init__("soil_moisture_volumetric", id, 2)
        self.addParameter(Parameter("temperature", 0, "°C"))
        self.addParameter(Parameter("volumetric_water_content", 0, "%"))
