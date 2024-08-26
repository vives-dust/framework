import os
import requests
import time
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

from reporter import Reporter
from sensors import WeatherStation, ReporterInternal, SoilMoistureTension, SoilMoistureVolumetric

def setup():
    print("Running setup for script")

    # Add sensors to the reporters
    print("Adding sensors to reporters...")
    reporters[0].addSensor(SoilMoistureTension(1180697180))
    reporters[0].addSensor(SoilMoistureVolumetric(1149240095))
    reporters[0].addSensor(SoilMoistureVolumetric(1239417629))
    reporters[0].addSensor(WeatherStation(1319108707))
    reporters[0].addSensor(ReporterInternal(reporters[0].id))

    reporters[1].addSensor(SoilMoistureTension(1096811105))
    reporters[1].addSensor(SoilMoistureVolumetric(1132462843))
    reporters[1].addSensor(SoilMoistureVolumetric(1333789438))
    reporters[1].addSensor(WeatherStation(1264582736))
    reporters[1].addSensor(ReporterInternal(reporters[1].id))
    print("Sensors added to reporters.")

def connectInfluxDB():
    influx_url = 'http://' + os.getenv("INFLUXDB_HOST") + ":" + os.getenv("INFLUXDB_PORT")
    print(f"Connecting to InfluxDB at {influx_url}")
    influx_token = os.getenv("INFLUXDB_TOKEN")
    influx_org = os.getenv("INFLUXDB_ORG")
    
    client = InfluxDBClient(url=influx_url, token=influx_token, org=influx_org)
    return client
    
    
def getMeasurement(reporterId):
    response = requests.get(f"{base_url}/{reporterId}/measurements/latest", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get data from reporter {reporterId}. Error code: {response.status_code}")
        return None
    
def ingestData():
    print("Ingesting data...")

    for reporter in reporters:
        data = getMeasurement(reporter.id)
        reporter.processMeasurement(data)
        print(f"Data ingested for reporter {reporter.id}.")

def saveData():
    print("Saving data to InfluxDB...")
    write_api = influx_client.write_api(write_options=SYNCHRONOUS)

    for reporter in reporters:
        for sensor in reporter.sensors:
            new_point = createPoint(reporter, sensor)
            write_api.write(bucket=influx_bucket, record=new_point)

    print("Data saved to InfluxDB.")

def createPoint(reporter, sensor):
    point = Point("crodeon")\
        .tag("location", reporter.location)\
        .tag("name", reporter.name)\
        .tag("reporter_id", reporter.id)\
        .tag("sensor_id", sensor.id)\
        .time(sensor.parameters[0].timestamp)
    
    for parameter in sensor.parameters:
            point.field(sensor.getParameterNameByParameter(parameter), parameter.value)
    return point

def main():
    print("-------------------- DEVBIT CRODEON SCRIPT --------------------")
    ingestData()
    saveData()

    # delay for x minutes
    print(f"Sleeping for {sample_freq} minutes...")
    time.sleep(sample_freq * 60)

if __name__ == "__main__":
    print("Starting script...")

    # Get the CRODEON configuration values
    base_url = os.getenv("CRODEON_BASE_URL")
    reporter_ids = os.getenv("CRODEON_REPORTERS").split(",")
    api_key = os.getenv("CRODEON_API_KEY")
    sample_freq = int(os.getenv("CRODEON_SAMPLE_FREQ_MIN"))

    # Create reporter objects
    reporters = []
    reporters.append(Reporter("bemaling_Ardooie", "Ardooie", "Case bemaling Ardooie - boom van Yves", reporter_ids[0]))
    reporters.append(Reporter("bemaling_Roeselare", "Roeselare", "Case bemaling Roeselare - Perenboom", reporter_ids[1]))

    # Construct headers
    headers = {
        "X-API-KEY": api_key,
        "Content-Type": "application/json"
    }

    # InfluxDB configuration
    influx_client = connectInfluxDB()
    influx_bucket = os.getenv("INFLUXDB_BUCKET")

    setup()
    
    while True:
        main()
