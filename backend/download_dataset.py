import kagglehub
import structlog
import time
import httpx

logger = structlog.get_logger()

def download_with_retry(dataset_handle: str, max_retries: int = 5, backoff_factor: int = 2):
    """
    Downloads a Kaggle dataset using kagglehub with robust retry logic to handle IncompleteRead errors.
    """
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Downloading dataset '{dataset_handle}' (Attempt {attempt}/{max_retries})...")
            # kagglehub.dataset_download internally uses httpx or urllib which can throw IncompleteRead on unstable connections
            path = kagglehub.dataset_download(dataset_handle)
            logger.info("Dataset downloaded successfully", path=path)
            return path
        except (httpx.ReadError, httpx.RequestError, Exception) as e:
            # We catch Exception broadly because IncompleteRead can be wrapped by urllib3 or http.client
            logger.error(f"Download failed on attempt {attempt}: {type(e).__name__} - {e}")
            if attempt == max_retries:
                logger.error("Max retries reached. Download failed.")
                raise e
            
            # Exponential backoff
            sleep_time = backoff_factor ** attempt
            logger.info(f"Retrying in {sleep_time} seconds...")
            time.sleep(sleep_time)

if __name__ == "__main__":
    dataset_name = "ellipticco/elliptic2-data-set"
    path = download_with_retry(dataset_name)
    print("Path to dataset files:", path)
