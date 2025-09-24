    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("prn"); 
    const uraName = document.getElementById('ura-name');
    const loader = document.getElementById('loading-dialog');
    const error = document.getElementById('error')
    const retryBtn = document.getElementById('retry-btn');
    const loaderImg = document.getElementById('loader-img');
    const loaderMsg = document.getElementById('loader-msg');

    window.uraData = {};
    

    if (param) {
       window.uraData.prn=param;
       validatePRN();
      } else {
      console.warn("No parameter provided in URL");
    }

    function validatePRN(){
      
       loaderMsg.innerHTML = "Fetching Payment Details..."
      // Print to browser console
      console.log("PRN value:", param);
      loader.style.display="flex";
      loaderImg.style.display="block"
      loaderMsg.style.display="block"
      error.style.display="none"
      retryBtn.style.display="none";
      
      setTimeout(()=>{
        loaderMsg.innerHTML = "Wait a little more..."
      },5000)

      setTimeout(()=>{
        loaderMsg.innerHTML = "Still working..."
      },15000)

      // Send to Spring Boot via GET
      fetch(`http://localhost:8081/isw/payments/receive?value=${encodeURIComponent(param)}`)
        .then(response => response.json())
        .then(data => {
          console.log("Response from Spring Boot:", data)
          const payment = data.response;
          console.log("Response from Spring Boot:", data.response)
          
          if(data.responseCode!=="90000"){
              loaderImg.style.display="none"
              loaderMsg.style.display="none"
              error.style.display="block";
              error.innerHTML = data?.responseMessage || 'An error occurred';
              retryBtn.style.display="block";
              return;
          }

          loader.style.display="none";
          if (payment?.customerName) document.getElementById("ura-name").textContent = data.response.customerName;
          if (payment.customerId) document.getElementById("ura-payto").textContent = payment.customerId;
          if (payment.reason) document.getElementById("ura-purpose").textContent = payment.reason;
          if (payment.customerId) document.getElementById("ura-prn").textContent = payment.customerId;
          if (payment.tin) document.getElementById("ura-tin").textContent = payment.tin;
          if (payment.amount) document.getElementById("ura-amount").textContent = payment.amount;

      // Optional input prefills
          if (data.customerEmail) document.getElementById("email").value = data.customerEmail;
          if (data.customerMobile) document.getElementById("phone").value = data.customerMobile;


           })
        .catch(err => console.error("Error:", err));

      
    }

    function captureAdditionalInfo(elem){
         const value = document.getElementById(elem).value
         if(elem==="email")
          window.uraData.customerEmail = value
        if(elem==="phone")
          window.uraData.customerMobile = value
    }
    

    function closePopup() {
      document.getElementById("checkout-popup").style.display = "none";
    }

    function openPopup() {

      document.getElementById("checkout-error").innerHTML="";

      if(!window?.uraData?.prn){
        document.getElementById("checkout-popup").style.display="none";
         //document.getElementById("checkout-popup").html ="No payment data provided."
         document.getElementById("checkout-error").style.display = "block";
         return;
      }

      
      document.getElementById("checkout-popup").style.display = "block";

      // ✅ ORIGINAL checkout payload (unchanged)
      const checkoutData = {
        transactionReference: "TXN_" + Date.now(),
        orderId: "ORD_" + Date.now(),
        amount: "1000",
        dateOfPayment: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 5 * 60000).toISOString(), // +5 mins
        redirectUrl: "http://localhost/ura-imp/result.html",
        narration: "URA Web Payment",
        customerId: "12345",
        customerFirstName: "John",
        customerSecondName: "Doe",
        customerEmail: window?.uraData.customerEmail,
        customerMobile: window?.uraData.customerMobile,
        merchantCode: "ISWKEN0001",
        domain: "ISWKE",
        currencyCode: "KES",
        terminalType: "WEB",
        channel: "WEB",
        fee: "0",
        merchantName: "URA Payment",
        redirectMerchantName: "Return to Portal",
        primaryAccentColor: "#0099ff",
        customerCity: "Nairobi",
        customerCountry: "KE",
        customerState: "NBI"
      };

      // Build hidden form
      const checkoutForm = document.createElement("form");
      checkoutForm.style.display = "none";
      checkoutForm.method = "POST";
      checkoutForm.target = "checkout-form-container";
      checkoutForm.action = "https://gatewaybackend-uat.quickteller.co.ke/ipg-backend/api/checkout";

      for (const key in checkoutData) {
        if (checkoutData.hasOwnProperty(key)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = checkoutData[key];
          checkoutForm.appendChild(input);
        }
      }

      document.body.appendChild(checkoutForm);
      checkoutForm.submit();
      document.body.removeChild(checkoutForm);
    }

    // 🔹 Separate object to store URA values from parent
    
    // 🔹 Listen for parent messages (when embedded as iframe)
    window.addEventListener("message", (event) => {
      // ✅ Security check: replace with your expected parent origin
      const allowedOrigin = "https://ura.go.ug";
      if (event.origin !== allowedOrigin) {
        console.warn("Blocked message from untrusted origin:", event.origin);
        return;
      }

      const data = event.data;
      console.log("Received URA data from parent:", data);

      // Store separately
      window.uraData = data;

      // Populate URA section
      if (data.name) document.getElementById("ura-name").textContent = data.name;
      if (data.payee) document.getElementById("ura-payto").textContent = data.payee;
      if (data.reason) document.getElementById("ura-purpose").textContent = data.reason;
      if (data.prn) document.getElementById("ura-prn").textContent = data.prn;
      if (data.tin) document.getElementById("ura-tin").textContent = data.tin;
      if (data.amount) document.getElementById("ura-amount").textContent = data.amount;

      // Optional input prefills
      if (data.customerEmail) document.getElementById("email").value = data.customerEmail;
      if (data.customerMobile) document.getElementById("phone").value = data.customerMobile;
    });