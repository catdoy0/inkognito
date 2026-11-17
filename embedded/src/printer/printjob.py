import cups
import logging
from .printer import Printer
from enum import Enum


class JobState(Enum):
    PENDING = 3
    PENDING_HELD = 4
    PROCESSING = 5
    PROCESSING_STOPPED = 6
    CANCELED = 7
    ABORTED = 8
    COMPLETED = 9

class PrintJob:

    def __init__(self, printer: Printer, job_id:int ):
        self.printer = printer
        self.conn = printer.conn
        self.job_id = job_id

    def get_job_state(self):
        try:
            job_attributes = self.conn.getJobAttributes(self.job_id)
            job_state_value = job_attributes.get('job-state', None)

            if job_state_value is not None:
                return JobState(job_state_value)
            else:
                logging.warning(f"Job state not found for job ID: {self.job_id}")
                return None

        except cups.IPPError as e:
            logging.error(f"Failed to get job state for job ID {self.job_id}: {e}")
            return None
    
    

    