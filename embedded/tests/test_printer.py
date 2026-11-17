from src.printer import Printer, PrintJob, JobState
import logging
import asyncio

def test_printer_initialization():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"

    printer = Printer(device_uri)
    logging.info(f"Printer initialized with URI: {printer.device_uri} and Name: {printer.printer_name}")

    assert True

def test_printer_print_test_page():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"

    printer = Printer(device_uri)
    logging.info(f"Printer initialized with URI: {printer.device_uri} and Name: {printer.printer_name}")
    
    job = asyncio.run(printer.print_test_page())
    logging.info("Test page print function executed.")

    assert job.get_job_state() in [JobState.COMPLETED]  # Adjust based on expected job states

def test_printer_print_document():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"
    file_path = "tests/test_document.txt"  # Ensure this file exists for the test

    printer = Printer(device_uri)
    logging.info(f"Printer initialized with URI: {printer.device_uri} and Name: {printer.printer_name}")

    job = asyncio.run(printer.print_document(file_path))


    logging.info(f"Document print function executed for file: {file_path}")

    assert job.get_job_state() in [JobState.COMPLETED]  # Adjust based on expected job states