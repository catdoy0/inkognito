import cups
import logging


class Printer:

    def __init__(self, device_uri:str):
        self.device_uri = device_uri
        self.conn = cups.Connection()
        self.printer = None

        # init printer
        self.get_printer()


    @property
    def printer_name(self):
        if self.printer:
            return self.printer
        else:
            raise ValueError("Printer not initialized. Please call get_printer() first.")

    
    def get_printer(self):
        printers = self.conn.getPrinters()
        for printer in printers:
            if printers[printer]['device-uri'] == self.device_uri:
                self.printer = printer
                return
        
        raise ValueError(f"Printer with device URI {self.device_uri} not found.")
    

    def print_test_page(self):
        try:
            job_id = self.conn.printTestPage(self.printer)
            logging.info(f"Test page printed successfully with job ID: {job_id}")

        except cups.IPPError as e:
            logging.error(f"Failed to print test page: {e}")
                



    