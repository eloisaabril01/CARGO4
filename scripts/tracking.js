// Tracking page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('tracking-form');
    const trackingResults = document.getElementById('tracking-results');
    const resultTrackingNumber = document.getElementById('result-tracking-number');

    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const trackingNumber = document.getElementById('tracking-number').value.trim();
            const shipmentType = document.getElementById('shipment-type').value;
            
            if (!trackingNumber) {
                window.CargoExpress.showNotification('Please enter a tracking number', 'error');
                return;
            }

            // Show loading state
            const submitBtn = trackingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<div class="loading mr-2"></div>Tracking...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show results
                if (resultTrackingNumber) {
                    resultTrackingNumber.textContent = trackingNumber;
                }
                
                // Update shipment details based on type
                updateShipmentDetails(shipmentType, trackingNumber);
                
                trackingResults.classList.remove('hidden');
                trackingResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                window.CargoExpress.showNotification('Shipment found successfully!', 'success');
            }, 2000);
        });
    }

    function updateShipmentDetails(shipmentType, trackingNumber) {
        const shipmentStatus = document.getElementById('shipment-status');
        const originLocation = document.getElementById('origin-location');
        const currentLocation = document.getElementById('current-location');
        const destinationLocation = document.getElementById('destination-location');
        const originDate = document.getElementById('origin-date');
        const currentDate = document.getElementById('current-date');
        const estimatedDate = document.getElementById('estimated-date');

        // Sample data based on shipment type
        const sampleData = {
            'sea': {
                status: 'In Transit',
                statusClass: 'bg-blue-100 text-blue-800',
                statusIcon: 'ri-ship-line',
                origin: 'Mumbai, India',
                current: 'Suez Canal, Egypt',
                destination: 'Rotterdam, Netherlands',
                originDate: 'Departed: Jan 10, 2025',
                currentDate: 'Updated: Jan 18, 2025',
                estimatedDate: 'ETA: Jan 28, 2025'
            },
            'air': {
                status: 'Out for Delivery',
                statusClass: 'bg-green-100 text-green-800',
                statusIcon: 'ri-plane-line',
                origin: 'Shanghai, China',
                current: 'New York, USA',
                destination: 'Chicago, USA',
                originDate: 'Departed: Jan 17, 2025',
                currentDate: 'Updated: Jan 18, 2025',
                estimatedDate: 'ETA: Jan 19, 2025'
            },
            'road': {
                status: 'In Transit',
                statusClass: 'bg-yellow-100 text-yellow-800',
                statusIcon: 'ri-truck-line',
                origin: 'Los Angeles, USA',
                current: 'Phoenix, Arizona',
                destination: 'Dallas, Texas',
                originDate: 'Departed: Jan 16, 2025',
                currentDate: 'Updated: Jan 18, 2025',
                estimatedDate: 'ETA: Jan 20, 2025'
            }
        };

        const data = sampleData[shipmentType] || sampleData['sea'];

        if (shipmentStatus) {
            shipmentStatus.className = `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${data.statusClass}`;
            shipmentStatus.innerHTML = `<i class="${data.statusIcon} mr-2"></i>${data.status}`;
        }

        if (originLocation) originLocation.textContent = data.origin;
        if (currentLocation) currentLocation.textContent = data.current;
        if (destinationLocation) destinationLocation.textContent = data.destination;
        if (originDate) originDate.textContent = data.originDate;
        if (currentDate) currentDate.textContent = data.currentDate;
        if (estimatedDate) estimatedDate.textContent = data.estimatedDate;
    }

    // Auto-fill tracking number from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const trackingParam = urlParams.get('tracking');
    if (trackingParam && document.getElementById('tracking-number')) {
        document.getElementById('tracking-number').value = trackingParam;
    }

    // Real-time updates simulation
    function simulateRealTimeUpdates() {
        if (trackingResults && !trackingResults.classList.contains('hidden')) {
            const currentDate = document.getElementById('current-date');
            if (currentDate) {
                const now = new Date();
                currentDate.textContent = `Updated: ${now.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                })} - ${now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}`;
            }
        }
    }

    // Update every 30 seconds when tracking results are visible
    setInterval(simulateRealTimeUpdates, 30000);

    // Print tracking details
    window.printTrackingDetails = function() {
        if (trackingResults && !trackingResults.classList.contains('hidden')) {
            const printWindow = window.open('', '_blank');
            const trackingNumber = resultTrackingNumber ? resultTrackingNumber.textContent : 'N/A';
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Tracking Details - ${trackingNumber}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; }
                        .logo { color: #1e40af; font-size: 24px; font-weight: bold; }
                        .tracking-number { font-size: 18px; margin: 10px 0; }
                        .details { margin: 20px 0; }
                        .detail-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                        .timeline { margin: 20px 0; }
                        .timeline-item { margin: 10px 0; padding: 10px; border-left: 3px solid #1e40af; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Cargo Express Logistics</div>
                        <div class="tracking-number">Tracking Number: ${trackingNumber}</div>
                    </div>
                    ${trackingResults.innerHTML}
                    <script>window.print(); window.close();</script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    // Export tracking details
    window.exportTrackingDetails = function(format = 'json') {
        if (trackingResults && !trackingResults.classList.contains('hidden')) {
            const trackingNumber = resultTrackingNumber ? resultTrackingNumber.textContent : 'N/A';
            const data = {
                trackingNumber: trackingNumber,
                status: document.getElementById('shipment-status')?.textContent || 'N/A',
                origin: document.getElementById('origin-location')?.textContent || 'N/A',
                current: document.getElementById('current-location')?.textContent || 'N/A',
                destination: document.getElementById('destination-location')?.textContent || 'N/A',
                exportDate: new Date().toISOString()
            };

            let content, filename, mimeType;

            if (format === 'json') {
                content = JSON.stringify(data, null, 2);
                filename = `tracking-${trackingNumber}.json`;
                mimeType = 'application/json';
            } else if (format === 'csv') {
                content = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
                filename = `tracking-${trackingNumber}.csv`;
                mimeType = 'text/csv';
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            window.CargoExpress.showNotification(`Tracking details exported as ${format.toUpperCase()}`, 'success');
        }
    };

    // Share tracking details
    window.shareTrackingDetails = function() {
        if (trackingResults && !trackingResults.classList.contains('hidden')) {
            const trackingNumber = resultTrackingNumber ? resultTrackingNumber.textContent : 'N/A';
            const status = document.getElementById('shipment-status')?.textContent || 'N/A';
            const current = document.getElementById('current-location')?.textContent || 'N/A';
            
            const shareData = {
                title: `Cargo Express - Tracking ${trackingNumber}`,
                text: `Shipment ${trackingNumber} is currently ${status} at ${current}`,
                url: `${window.location.origin}/tracking.html?tracking=${trackingNumber}`
            };

            if (navigator.share) {
                navigator.share(shareData).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(shareData);
                });
            } else {
                fallbackShare(shareData);
            }
        }
    };

    function fallbackShare(shareData) {
        // Copy to clipboard as fallback
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                window.CargoExpress.showNotification('Tracking details copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            window.CargoExpress.showNotification('Tracking details copied to clipboard!', 'success');
        }
    }

    console.log('Tracking functionality initialized');
});