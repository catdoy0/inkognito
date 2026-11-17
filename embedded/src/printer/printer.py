import cups
import logging
from pathlib import Path
import asyncio
import typing
from .printjob import PrintJob, JobState

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

    def start_print_test_page(self) -> 'PrintJob':
        if not self.printer:
            raise ValueError("Printer not initialized. Please call get_printer() first.")

        try:
            job_id = self.conn.printTestPage(self.printer)
            logging.info(f"Test page sent to printer {self.printer} with job ID: {job_id}")
            # get printjob
            job = PrintJob(self, job_id)
            return job
        
        except cups.IPPError as e:
            logging.error(f"Failed to print test page: {e}")
            raise e

    def start_print_document(self, file_path: str | Path, pages: typing.Optional[list[int]] = None) -> 'PrintJob':
        if not self.printer:
            raise ValueError("Printer not initialized. Please call get_printer() first.")

        if not Path(file_path).exists():
            raise FileNotFoundError(f"The file {file_path} does not exist.")

        try:
            job_id = self.conn.printFile(self.printer, str(file_path), "Print Job", {})
            logging.info(f"Document {file_path} sent to printer {self.printer} with job ID: {job_id}")
            # get printjob

            job = PrintJob(self, job_id)
            return job
        
        except cups.IPPError as e:
            logging.error(f"Failed to print document {file_path}: {e}")
            raise e

    async def _wait_for_job_completion(self, job: 'PrintJob'):
        job_state = job.get_job_state()

        # wait for job to complete
        while job_state not in [JobState.COMPLETED, JobState.ABORTED, JobState.CANCELED, JobState.PROCESSING_STOPPED]:
            await asyncio.sleep(1)
            job_state = job.get_job_state()
            logging.debug(f"Job {job.job_id} state: {job_state}")

        if job_state in [JobState.ABORTED, JobState.CANCELED, JobState.PROCESSING_STOPPED]:
            logging.error(f"Job {job.job_id} failed to start. State: {job_state}")
            return False

        elif job_state == JobState.COMPLETED:
            logging.info(f"Job {job.job_id} completed successfully.")
            return True
    
    async def print_document(self, file_path: str | Path , pages: typing.Optional[list[int]] = None):
        job = self.start_print_document(file_path,pages)

        await self._wait_for_job_completion(job)

        return job

    async def print_test_page(self):
        job = self.start_print_test_page()
        await self._wait_for_job_completion(job)
        return job



    