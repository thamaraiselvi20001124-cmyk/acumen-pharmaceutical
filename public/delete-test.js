// Delete Job - with detailed logging
async function deleteJob(jobId) {
    console.log('deleteJob called with ID:', jobId);
    const job = jobs.find(j => j.id == jobId);
    console.log('Found job:', job);

    if (!job) {
        console.error('Job not found!');
        alert('Job not found!');
        return;
    }

    if (!confirm(`Are you sure you want to delete job "${job.title}"?`)) {
        console.log('User cancelled deletion');
        return;
    }

    console.log('Attempting to delete job...');

    try {
        const url = `http://localhost:3000/api/jobs/${jobId}`;
        console.log('DELETE URL:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log('Delete successful:', data);
            alert('Job deleted successfully!');
            await loadJobs();
        } else {
            const errorText = await response.text();
            console.error('Delete failed. Status:', response.status, 'Error:', errorText);
            alert(`Error deleting job: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert(`Network error deleting job: ${error.message}`);
    }
}
