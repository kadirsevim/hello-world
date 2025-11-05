from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["payment"])

# İyzico credentials (sandbox for testing)
IYZICO_API_KEY = os.environ.get('IYZICO_API_KEY', 'sandbox-test-key')
IYZICO_SECRET_KEY = os.environ.get('IYZICO_SECRET_KEY', 'sandbox-test-secret')

class PaymentItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int

class PaymentRequest(BaseModel):
    order_id: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: str
    customer_city: str
    customer_zip_code: str
    card_holder_name: str
    card_number: str
    expiry_month: str
    expiry_year: str
    cvc: str
    items: List[PaymentItem]
    total_amount: float

@router.post("/payment/process")
async def process_payment(payment: PaymentRequest):
    """
    Process payment with iyzico.
    For MVP: Simulated payment with test cards.
    Test Cards:
    - Success: 5528790000000008 (12/2030, CVV: 123)
    - Failure: 4111111111111129 (any date, any CVV)
    """
    try:
        logger.info(f"Processing payment for order: {payment.order_id}")
        
        # Test card validation
        test_success_card = "5528790000000008"
        test_failure_card = "4111111111111129"
        
        # Remove spaces from card number
        card_number = payment.card_number.replace(" ", "")
        
        # Simulate payment processing
        if card_number == test_success_card:
            # Success scenario
            return {
                "status": "success",
                "payment_id": f"PAY-{payment.order_id}",
                "message": "Ödeme başarıyla tamamlandı",
                "order_id": payment.order_id,
                "amount": payment.total_amount
            }
        elif card_number == test_failure_card:
            # Failure scenario
            return {
                "status": "failure",
                "error_code": "10051",
                "message": "Yetersiz bakiye",
                "order_id": payment.order_id
            }
        else:
            # For MVP, treat other cards as test success
            return {
                "status": "success",
                "payment_id": f"PAY-{payment.order_id}",
                "message": "Ödeme başarıyla tamamlandı (TEST MODE)",
                "order_id": payment.order_id,
                "amount": payment.total_amount,
                "note": "Production'da gerçek iyzico API kullanılacak"
            }
            
    except Exception as e:
        logger.error(f"Payment processing error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Ödeme işlemi sırasında hata oluştu: {str(e)}"
        )

@router.get("/payment/test-cards")
async def get_test_cards():
    """Get test card information"""
    return {
        "test_cards": [
            {
                "type": "success",
                "number": "5528 7900 0000 0008",
                "expiry": "12/2030",
                "cvv": "123",
                "name": "TEST USER"
            },
            {
                "type": "failure",
                "number": "4111 1111 1111 1129",
                "expiry": "12/2030",
                "cvv": "123",
                "name": "TEST USER"
            }
        ],
        "note": "Bu test kartları sadece development ortamında çalışır. Production'da gerçek iyzico API kullanılacak."
    }
