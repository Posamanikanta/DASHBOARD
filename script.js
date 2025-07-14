  //canva//
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function drawSimpleBackground() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(102, 126, 234, 0.1)");
      gradient.addColorStop(1, "rgba(118, 75, 162, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 107, 107, 0.1)";
      ctx.beginPath();
      ctx.arc(200, 200, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(78, 205, 196, 0.1)";
      ctx.beginPath();
      ctx.arc(canvas.width - 200, 400, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    drawSimpleBackground();
    window.addEventListener("resize", drawSimpleBackground);

    //geolocation//
    const locationButton = document.getElementById("button");
    const output = document.getElementById("output");

    locationButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        output.innerHTML = `
          <strong>❌ Error:</strong> Geolocation is not supported by this browser.
        `;
        return;
      }

      output.innerHTML = `
        <div class="loading"></div>
        <strong>🔍 Fetching location...</strong> Please wait while we determine your position.
      `;

      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await response.json();
          const address = data.address;

          const city = address.city || address.town || address.village || "Unknown";
          const state = address.state || "Unknown";
          const sub = address.suburb || "Unknown";
        

          output.innerHTML = `
            <strong>🌍 Latitude:</strong> ${lat.toFixed(6)}<br>
            <strong>🌍 Longitude:</strong> ${lon.toFixed(6)}<br>
            <strong>🏘️ Suburb:</strong> ${sub}<br>
          
            <strong>🏙️ City:</strong> ${city}<br>
            <strong>🏛️ State:</strong> ${state}<br>
          
          `;
        } catch (error) {
          output.innerHTML = `
            <strong>⚠️ Warning:</strong> Location found but address lookup failed.<br>
            <strong>🌍 Latitude:</strong> ${lat.toFixed(6)}<br>
            <strong>🌍 Longitude:</strong> ${lon.toFixed(6)}
          `;
        }
      }, (error) => {
        let errorMessage = "Unable to retrieve location.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        output.innerHTML = `<strong>❌ Error:</strong> ${errorMessage}`;
      });
    });

    //NETWORK//
    const netout = document.getElementById("networkoutput");
    
    function updateNetworkInfo() {
      const onlineStatus = navigator.onLine;
      const connection = navigator.connection || navigator.mozConnection;
      
      const statusText = onlineStatus ? 'Online' : 'Offline';
      const statusIcon = onlineStatus ? '✅' : '❌';
      
      netout.innerHTML = `
        <strong>📡 Status:</strong> ${statusText} ${statusIcon}<br>
        <strong>🔗 Connection:</strong> ${connection?.effectiveType || "Unknown"}<br>
        <strong>⚡ Speed:</strong> ${connection?.downlink || "N/A"} Mbps<br>
        <strong>💾 Data Saver:</strong> ${connection?.saveData ? "Enabled" : "Disabled"}
      `;
    }

    updateNetworkInfo();
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

  