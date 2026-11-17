from src.printer import Printer
import logging


def test_printer_initialization():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"

    printer = Printer(device_uri)
    logging.info(f"Printer initialized with URI: {printer.device_uri} and Name: {printer.printer_name}")

    assert True

def test_printer_print_test_page():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"

    printer = Printer(device_uri)
    logging.info(f"Printer initialized with URI: {printer.device_uri} and Name: {printer.printer_name}")

    printer.print_test_page()
    logging.info("Test page print function executed.")

    assert True