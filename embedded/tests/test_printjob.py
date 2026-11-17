from src.printer import Printer, PrintJob, JobState
import logging
logging.basicConfig(level=logging.INFO)

def test_printjob_attributes():
    device_uri = "dnssd://Canon%20E3400%20series._ipp._tcp.local/?uuid=00000000-0000-1000-8000-0018b8627ea4"
    printer = Printer(device_uri)

    # Assuming a job ID for testing purposes. Replace with a valid job ID.
    job_id = 73
    print_job = PrintJob(printer, job_id)

    # Test getting job state
    job_state = print_job.get_job_state()

    logging.info(f"Job State: {job_state}")
    assert isinstance(job_state, JobState) or job_state is None

    # Test getting job state reasons
    job_state_reasons = print_job.get_job_state_reasons()
    logging.info(f"Job State Reasons: {job_state_reasons}")
    assert isinstance(job_state_reasons, str) or job_state_reasons is None

    # Test getting job state message
    job_state_message = print_job.get_job_state_message()
    logging.info(f"Job State Message: {job_state_message}") 
    assert isinstance(job_state_message, str) or job_state_message is None

    # Test number of pages
    number_of_pages = print_job.number_of_pages
    logging.info(f"Number of Pages: {number_of_pages}")
    assert isinstance(number_of_pages, int) or number_of_pages is None

    # Test sheets completed
    sheets_completed = print_job.sheets_completed
    logging.info(f"Sheets Completed: {sheets_completed}")
    assert isinstance(sheets_completed, int) or sheets_completed is None

    # Test job progress
    job_progress = print_job.job_progress
    logging.info(f"Job Progress: {job_progress}")
    assert isinstance(job_progress, int) or job_progress is None

    # test job name
    job_name = print_job.job_name
    logging.info(f"Job Name: {job_name}")
    assert isinstance(job_name, str) or job_name is None

    # test job file size
    job_file_size = print_job.file_size
    logging.info(f"Job File Size: {job_file_size}")
    assert isinstance(job_file_size, int) or job_file_size is None