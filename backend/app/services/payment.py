import httpx
from typing import Dict, Any, Optional
import hmac
import hashlib
import json
from app.core.config import settings

class PaymentService:
    def __init__(self):
        self.paystack_secret_key = settings.PAYSTACK_SECRET_KEY if hasattr(settings, 'PAYSTACK_SECRET_KEY') else "sk_test_placeholder"
        self.paypal_client_id = settings.PAYPAL_CLIENT_ID if hasattr(settings, 'PAYPAL_CLIENT_ID') else "placeholder_id"
        self.paypal_secret = settings.PAYPAL_SECRET if hasattr(settings, 'PAYPAL_SECRET') else "placeholder_secret"
        
    async def initialize_paystack_payment(self, email: str, amount: float, reference: str) -> Dict[str, Any]:
        """Initialize a Paystack payment session."""
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {self.paystack_secret_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "email": email,
            "amount": int(amount * 100), # Paystack uses kobo/cents
            "reference": reference,
            "callback_url": f"{settings.FRONTEND_URL}/payment/callback"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            return response.json()

    async def verify_paystack_payment(self, reference: str) -> Dict[str, Any]:
        """Verify a Paystack transaction."""
        url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {self.paystack_secret_key}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            return response.json()

    async def get_paypal_access_token(self) -> str:
        """Get PayPal OAuth2 access token."""
        url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        headers = {
            "Accept": "application/json",
            "Accept-Language": "en_US"
        }
        data = {"grant_type": "client_credentials"}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url, 
                headers=headers, 
                auth=(self.paypal_client_id, self.paypal_secret),
                data=data
            )
            return response.json()["access_token"]

    async def create_paypal_order(self, amount: float, reference: str) -> Dict[str, Any]:
        """Create a PayPal order."""
        token = await self.get_paypal_access_token()
        url = "https://api-m.sandbox.paypal.com/v2/checkout/orders"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": reference,
                "amount": {
                    "currency_code": "USD",
                    "value": str(amount)
                }
            }]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            return response.json()

payment_service = PaymentService()
