from pydantic import BaseModel
from typing import List, Dict, Any

class WorkshopStats(BaseModel):
    years_experience: int = 22
    established_year: int = 2003
    total_motors_rewound: int = 5480
    active_amc_clients: int = 48
    avg_emergency_response_mins: int = 45
    satisfied_clients: int = 1920
    licensed_contractor_class: str = "Class-B (08/626/B)"
    wireman_license: str = "NR/10464"
    gumasta_license: str = "000107/RPR/5/2021"
    gstin: str = "22BDBPM9804K2ZH"
    location: str = "Nagar Palika Road, Tilda Neora, Raipur, Chhattisgarh"
    phone: str = "+91 9669718100"
    whatsapp: str = "+91 9669718100"
    email: str = "afjaleng@gmail.com"
