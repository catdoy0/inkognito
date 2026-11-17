import logging
from enum import Enum
import typing
import cups

if typing.TYPE_CHECKING:
    from .printer import Printer

class JobState(Enum):
    PENDING = 3
    PENDING_HELD = 4
    PROCESSING = 5
    PROCESSING_STOPPED = 6
    CANCELED = 7
    ABORTED = 8
    COMPLETED = 9

class PrintJob:

    def __init__(self, printer: 'Printer', job_id:int ):
        self.printer = printer
        self.conn = printer.conn
        self.job_id = job_id


    def _get_attribute(self, attribute_name: str, *params):
        try:
            job_attributes = self.conn.getJobAttributes(self.job_id)
            return job_attributes.get(attribute_name, params if params else None)
        except cups.IPPError as e:
            logging.error(f"Failed to get attribute '{attribute_name}' for job ID {self.job_id}: {e}")
            return None
        
    def get_job_state(self) -> JobState | None:
        job_state_int = self._get_attribute('job-state',0)
        if job_state_int is not None:
            try:
                return JobState(job_state_int)
            except ValueError:
                logging.warning(f"Unknown job state: {job_state_int}")
        return None


    def get_job_state_reasons(self) -> str:

        return self._get_attribute('job-state-reasons')

    def get_job_state_message(self) -> str | None:

        return self._get_attribute('job-state-message')

    @property
    def number_of_pages(self) -> int | None:
        return self._get_attribute('number-of-pages')

    @property
    def sheets_completed(self) -> int | None:
        return self._get_attribute('job-media-sheets-completed')    

    @property
    def job_progress(self) -> int | None:
        return self._get_attribute('job-media-progress')

    @property
    def job_name(self) -> str | None:
        return self._get_attribute('job-name')

    @property
    def file_size(self) -> int | None:
        return self._get_attribute('job-k-octets')