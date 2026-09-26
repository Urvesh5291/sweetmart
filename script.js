function sendToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('custName').value.trim();
    const item = document.getElementById('custItem').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    const phoneNumber = "919173565466"; // Patel Sweet Mart WhatsApp Number

    const message = `नमस्ते, मारा माटे ओर्डर छे:%0A*नाम:* ${name}%0A*પ્રોડક્ટ:* ${item}%0A*સરનામું:* ${address}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, '_blank');
}
