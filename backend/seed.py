import asyncio
from datetime import datetime
from lib.db import db

async def seed_data():
    print("Clearing existing seed collections...")
    await db.job_trackers.delete_many({})
    await db.reviews.delete_many({})
    await db.leads.delete_many({})
    await db.emergency_dispatches.delete_many({})

    print("Seeding job tracker records...")
    sample_jobs = [
        {
            "id": "job_001",
            "job_id": "AE-2024-8901",
            "customer_name": "Alok Agrawal",
            "company_name": "Siltara Agro & Re-rolling Mills",
            "phone": "9826198765",
            "equipment_name": "50 HP 3-Phase Induction Motor",
            "equipment_specs": "50 HP (37 kW), 1440 RPM, 415V 3-Phase, Kirloskar Heavy Duty",
            "service_type": "Complete Dual-Layer Copper Rewinding & SKF Bearing Overhaul",
            "intake_date": "2025-02-18",
            "estimated_delivery": "2025-02-23",
            "current_stage": "Dynamic Balancing & Load Testing",
            "status_percentage": 85,
            "steps": [
                {
                    "step_number": 1,
                    "title": "Diagnostic & Surge Testing",
                    "description": "Equipment received. 5000V Megger test showed 0.2 MΩ (severe phase-to-ground short). Thermal burn pattern verified.",
                    "completed": True,
                    "completed_at": "2025-02-18 11:30"
                },
                {
                    "step_number": 2,
                    "title": "Stripping & Core Prep",
                    "description": "Burnt winding stripped under controlled heat. Core slots cleared, deburred, and lined with Nomex Class-H insulation.",
                    "completed": True,
                    "completed_at": "2025-02-19 16:00"
                },
                {
                    "step_number": 3,
                    "title": "100% Copper Coil Winding",
                    "description": "Hand-crafted 100% Electrolytic dual-coated copper winding installed. Phase separators and slot wedges fitted to spec.",
                    "completed": True,
                    "completed_at": "2025-02-20 18:45"
                },
                {
                    "step_number": 4,
                    "title": "Vacuum Pressure Varnish & Baking",
                    "description": "Dual-dip high dielectric synthetic varnish, baked at 135°C in industrial oven for 8 hours for moisture barrier.",
                    "completed": True,
                    "completed_at": "2025-02-21 14:15"
                },
                {
                    "step_number": 5,
                    "title": "Dynamic Balancing & Load Testing",
                    "description": "Rotor dynamic balancing (<1.2 mm/s vibration), new SKF 6310 C3 bearings fitted. Full load thermal run in progress.",
                    "completed": True,
                    "completed_at": "2025-02-22 10:00"
                },
                {
                    "step_number": 6,
                    "title": "Quality Certified & Ready",
                    "description": "Final inspection certificate and dispatch clearance under Class-B supervisor.",
                    "completed": False,
                    "completed_at": None
                }
            ],
            "test_readings": [
                {"parameter": "Insulation Resistance (Phase to Earth)", "value": "250 MΩ @ 1000V DC", "standard_spec": "> 100 MΩ", "status": "Passed"},
                {"parameter": "Winding Resistance Balance (U-V-W)", "value": "0.384 Ω / 0.385 Ω / 0.383 Ω", "standard_spec": "< 2% variance", "status": "Passed"},
                {"parameter": "No-load Current Balance", "value": "18.2 A / 18.1 A / 18.3 A", "standard_spec": "17 - 20 A", "status": "Passed"},
                {"parameter": "Vibration Velocity (RMS)", "value": "1.15 mm/s", "standard_spec": "< 1.8 mm/s ISO 10816", "status": "Passed"},
                {"parameter": "Temperature Rise at Full Load", "value": "42°C above ambient", "standard_spec": "< 80°C (Class-H)", "status": "Passed"}
            ],
            "technician_notes": "Rewinding completed with Class-H copper wire. Excellent resistance balance. Motor runs cool with zero shaft vibration. Ready for final handover tomorrow morning.",
            "wire_type": "100% Electrolytic Dual-Coated Copper (Class-H 180°C)",
            "warranty_months": 6,
            "created_at": datetime.utcnow()
        },
        {
            "id": "job_002",
            "job_id": "AE-2024-8902",
            "customer_name": "Rameshwar Sahu",
            "company_name": "Mahamaya Modern Rice Mill",
            "phone": "9425211223",
            "equipment_name": "25 HP Submersible Borewell Pump",
            "equipment_specs": "25 HP (18.5 kW), 2880 RPM, Texmo Water-Filled Submersible Motor",
            "service_type": "Water-Proof Poly-Winding & Carbon Bush Replacement",
            "intake_date": "2025-02-15",
            "estimated_delivery": "2025-02-19",
            "current_stage": "Ready for Pickup / Dispatch",
            "status_percentage": 100,
            "steps": [
                {"step_number": 1, "title": "Diagnostic & Surge Testing", "description": "High voltage water tank insulation test completed.", "completed": True, "completed_at": "2025-02-15 10:00"},
                {"step_number": 2, "title": "Stripping & Core Prep", "description": "Water-damaged winding removed, stator core descaled.", "completed": True, "completed_at": "2025-02-16 12:00"},
                {"step_number": 3, "title": "100% Copper Coil Winding", "description": "High-grade submersible poly-wrap copper wire wound.", "completed": True, "completed_at": "2025-02-17 15:00"},
                {"step_number": 4, "title": "Vacuum Pressure Varnish & Baking", "description": "Polymer water-sealing and pressure gasket fitted.", "completed": True, "completed_at": "2025-02-18 11:00"},
                {"step_number": 5, "title": "Dynamic Balancing & Load Testing", "description": "Underwater pressure run test passed at 12 bar.", "completed": True, "completed_at": "2025-02-18 17:00"},
                {"step_number": 6, "title": "Quality Certified & Ready", "description": "Tested and packed with 6-month warranty certificate.", "completed": True, "completed_at": "2025-02-19 09:30"}
            ],
            "test_readings": [
                {"parameter": "Submerged Megger Test", "value": "180 MΩ @ 500V DC", "standard_spec": "> 50 MΩ", "status": "Passed"},
                {"parameter": "Thrust Bearing Axial Play", "value": "0.12 mm", "standard_spec": "< 0.25 mm", "status": "Passed"},
                {"parameter": "Current Draw @ 415V", "value": "34.5 A", "standard_spec": "33 - 36 A", "status": "Passed"}
            ],
            "technician_notes": "Complete water-proof poly copper rewind done. New carbon thrust bearings installed. Pump tested under full head pressure.",
            "wire_type": "Submersible High-Dielectric Poly Winding Wire",
            "warranty_months": 6,
            "created_at": datetime.utcnow()
        },
        {
            "id": "job_003",
            "job_id": "AE-2024-8903",
            "customer_name": "Harpreet Singh",
            "company_name": "Urla Industrial Fabrication",
            "phone": "9827154321",
            "equipment_name": "100 HP Crane Hoist Slip-Ring Motor",
            "equipment_specs": "100 HP (75 kW), 960 RPM Slip-Ring Wound Rotor Motor, Crompton Greaves",
            "service_type": "Stator & Rotor Simultaneous Dual Rewinding",
            "intake_date": "2025-02-20",
            "estimated_delivery": "2025-02-26",
            "current_stage": "100% Copper Coil Winding",
            "status_percentage": 45,
            "steps": [
                {"step_number": 1, "title": "Diagnostic & Surge Testing", "description": "High temperature breakdown in rotor coils detected.", "completed": True, "completed_at": "2025-02-20 14:00"},
                {"step_number": 2, "title": "Stripping & Core Prep", "description": "Both stator and slip-ring rotor cores stripped and cleaned.", "completed": True, "completed_at": "2025-02-21 16:30"},
                {"step_number": 3, "title": "100% Copper Coil Winding", "description": "Heavy-gauge square copper wire winding underway for rotor.", "completed": True, "completed_at": "2025-02-22 18:00"},
                {"step_number": 4, "title": "Vacuum Pressure Varnish & Baking", "description": "Scheduled for double VPI treatment.", "completed": False, "completed_at": None},
                {"step_number": 5, "title": "Dynamic Balancing & Load Testing", "description": "Precision rotor balance pending.", "completed": False, "completed_at": None},
                {"step_number": 6, "title": "Quality Certified & Ready", "description": "Pending final testing.", "completed": False, "completed_at": None}
            ],
            "test_readings": [
                {"parameter": "Core Loss & Magnetizing Test", "value": "1.2 W/kg (Healthy)", "standard_spec": "< 1.5 W/kg", "status": "Passed"},
                {"parameter": "Slip Ring Runout", "value": "0.03 mm", "standard_spec": "< 0.05 mm", "status": "Passed"}
            ],
            "technician_notes": "Heavy duty slip-ring winding in progress with Class-H copper. Rotor slot alignment verified.",
            "wire_type": "Heavy Dual-Coat Class-H Rectangular & Round Copper",
            "warranty_months": 6,
            "created_at": datetime.utcnow()
        }
    ]
    await db.job_trackers.insert_many(sample_jobs)

    print("Seeding customer reviews...")
    sample_reviews = [
        {
            "author_name": "Rameshwar Sahu",
            "company_or_location": "Owner, Mahamaya Rice Mill (Tilda Neora)",
            "rating": 5,
            "equipment_serviced": "75 HP & 50 HP Mill Induction Motors",
            "review_text": "Afjal bhai has been maintaining our rice mill electrical systems for over 12 years. Whenever a motor breaks down during peak paddy season, he rewinds it with genuine copper wire and gives same-day turnaround. Never had a repeated fault.",
            "verified_customer": True,
            "created_at": datetime.utcnow()
        },
        {
            "author_name": "Alok Agrawal",
            "company_or_location": "Plant Head, Siltara Rolling Mills (Raipur)",
            "rating": 5,
            "equipment_serviced": "415V Main LT Distribution Panel & 100 HP Motor",
            "review_text": "Their emergency breakdown dispatch is unmatched. We had a critical switchgear flashover at 9 PM on a weekend; Mohammad Afjal and his senior wiremen reached our Siltara plant in 45 minutes and restored the line safely.",
            "verified_customer": True,
            "created_at": datetime.utcnow()
        },
        {
            "author_name": "Dinesh Verma",
            "company_or_location": "Irrigation Contractor, Raipur Rural District",
            "rating": 5,
            "equipment_serviced": "20 HP & 25 HP Submersible Borewell Pumps",
            "review_text": "The 6-month written guarantee and dynamic balancing make all the difference. Other local shops use sub-standard aluminum mix wire, but Afjal Electrical uses 100% electrolytic copper. Our pump power consumption actually dropped.",
            "verified_customer": True,
            "created_at": datetime.utcnow()
        },
        {
            "author_name": "Harpreet Singh",
            "company_or_location": "Urla Industrial Fabrication Works",
            "rating": 5,
            "equipment_serviced": "Heavy Crane Slip-Ring Motors & HT Panels",
            "review_text": "Finding a Class-B licensed contractor who is also an expert hands-on rewinding craftsman is extremely rare. They know every inch of motor physics. Highly recommended for any industrial facility in Chhattisgarh.",
            "verified_customer": True,
            "created_at": datetime.utcnow()
        },
        {
            "author_name": "Santosh Dewangan",
            "company_or_location": "Commercial Complex Developer, Neora",
            "rating": 5,
            "equipment_serviced": "Complete Commercial Building 3-Phase Wiring & Panels",
            "review_text": "Licensed wireman NR/10464 work with proper load calculation, MCB grading, and earth resistance testing. Clean, compliant, and zero hassles during electrical inspector clearance.",
            "verified_customer": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.reviews.insert_many(sample_reviews)

    print("Seeding sample emergency dispatch...")
    sample_dispatch = {
        "id": "SOS-9812",
        "contact_name": "Vikram Patel",
        "phone": "9826012345",
        "facility_name": "Patel Agro Cold Storage",
        "location_area": "Tilda Neora Road",
        "address_details": "Plot 14, Near Railway Crossing, Tilda",
        "equipment_type": "Compressor Motor Sparking & Trip",
        "urgency_level": "immediate_2hr",
        "problem_description": "Main refrigeration 40 HP motor sparking at terminal box and tripping 200A MCCB repeatedly.",
        "status": "dispatched",
        "assigned_technician": "Mohammad Afjal & Rapid Response Team",
        "eta_minutes": 25,
        "created_at": datetime.utcnow()
    }
    await db.emergency_dispatches.insert_one(sample_dispatch)

    print("Seed complete successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
