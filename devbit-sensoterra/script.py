import os
from dotenv import load_dotenv
import requests
import time
import datetime
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from probe import Probe

def setup():
    print("Running setup for script")

    # Get the list of probes
    response = requests.get(base_url + "/probe", headers=headers)
    if response.status_code == 200:
        probes_data = response.json()
        for probe_data in probes_data:
            location = str(probe_data["latitude"]) + ", " + str(probe_data["longitude"])
            probe = Probe(probe_data["name"], location, probe_data["id"])
            probes.append(probe)
            print(f"Added probe: {probe.name}")
    else:
        print(f"Failed to get probes. Error code: {response.status_code}")

def connectInfluxDB():
    influx_url = 'http://' + os.getenv("INFLUXDB_HOST") + ":" + os.getenv("INFLUXDB_PORT")
    print(f"Connecting to InfluxDB at {influx_url}")
    influx_token = os.getenv("INFLUXDB_TOKEN")
    influx_org = os.getenv("INFLUXDB_ORG")
    
    client = InfluxDBClient(url=influx_url, token=influx_token, org=influx_org)
    return client

def getMeasurement(probeId):
    current_time = datetime.datetime.now(datetime.UTC)
    previous_time = current_time - datetime.timedelta(minutes=sample_freq)
    current_time = current_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    previous_time = previous_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    request_url = f"{base_url}/probe/{probeId}/{previous_time}/{current_time}?aggregate_by=none"

    response = requests.get(request_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get data from reporter {probeId}. Error code: {response.status_code}")
        return None
    
def ingestData():
    print("Ingesting data...")

    for probe in probes:
        data = getMeasurement(probe.id)
        probe.processMeasurement(data)
        print(f"Data ingested for reporter {probe.id}.")

def createPoint(probe):
    point = Point("sensoterra")\
        .tag("location", probe.location)\
        .tag("latitude", probe.location.split(",")[0])\
        .tag("longitude", probe.location.split(",")[1])\
        .tag("name", probe.name)\
        .tag("probe_id", probe.id)\
        .time(probe.parameters[0].timestamp)
    
    for parameter in probe.parameters:
            point.field(parameter.type, parameter.value)

    return point

def saveData():
    print("Saving data to InfluxDB...")
    write_api = influx_client.write_api(write_options=SYNCHRONOUS)

    for probe in probes:
        new_point = createPoint(probe)
        write_api.write(bucket=influx_bucket, record=new_point)

    print("Data saved to InfluxDB.")

def main():
    print("-------------------- DEVBIT SENSOTERRA SCRIPT --------------------")

    ingestData()
    saveData()

    # delay for x minutes
    print(f"Sleeping for {sample_freq} minutes...")
    time.sleep(sample_freq * 60)

if __name__ == "__main__":
    print("Starting script...")

    load_dotenv()

    # Get the SENSOTERRA configuration values
    base_url = os.getenv("SENSOTERRA_BASE_URL")
    api_key = os.getenv("SENSOTERRA_API_KEY")
    sample_freq = int(os.getenv("SENSOTERRA_SAMPLE_FREQ"))

    # Create probe objects
    probes = []

    # Construct headers
    headers = {
        "api_key": api_key,
        "Content-Type": "application/json"
    }

    # InfluxDB configuration
    influx_client = connectInfluxDB()
    influx_bucket = os.getenv("INFLUXDB_BUCKET")

    setup()
    
    while True:
        main()