# A Reporter class containing the different sensors of a Crodeon reporter
from sensors import Sensor

class Reporter:
    def __init__(self, name, location, description, id):
        self.name = name
        self.location = location
        self.description = description
        self.id = id
        self.sensors = []

    def addSensor(self, sensor: Sensor):
        self.sensors.append(sensor)

    def processMeasurement(self, data):
        items = data["items"]

        for item in items:
            itemDeviceId = item["device_id"]["id"]
            for sensor in self.sensors:
                if sensor.id == itemDeviceId:
                    channel = item["channel_index"]
                    parameter = sensor.getParameterNameByChannel(channel)
                    timestamp = item["timestamp"]
                    value = item["value"] / 10 # divide by 10 for correct value
                    if parameter == "power_supply_reporter_internal":
                        value = item["value"]
                    if parameter == "wind_direction_weather_station":
                        value = (item["value"] - 1) * 22.5
                    sensor.setParameterValue(channel, value, timestamp)

    