function updateProfileConfirm() {
    if (confirm('Are you sure you want to update your profile?')) {
        const form = document.getElementById('prof')
        form.requestSubmit()
    }
}
