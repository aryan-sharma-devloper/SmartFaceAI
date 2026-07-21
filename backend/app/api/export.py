from io import BytesIO

import pandas as pd
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.database import get_db
from app.models.verification_log import VerificationLog
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
router = APIRouter(
    prefix="/export",
    tags=["Export"],
)


@router.get("/logs/excel")
def export_logs_excel(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    logs = (
        db.query(VerificationLog)
        .order_by(VerificationLog.id.desc())
        .all()
    )

    data = []

    for log in logs:

        data.append({

            "ID": log.id,
            "User ID": log.user_id,
            "Status": log.status,
            "Confidence": log.confidence_score,
            "Camera": log.camera_name,
            "Response Time (ms)": log.response_time_ms,
            "Created At": log.created_at,

        })

    df = pd.DataFrame(data)

    output = BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(
            writer,
            index=False,
            sheet_name="Verification Logs",
        )

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            "attachment; filename=verification_logs.xlsx"
        },
    )
@router.get("/logs/pdf")
def export_logs_pdf(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    logs = (
        db.query(VerificationLog)
        .order_by(VerificationLog.id.desc())
        .all()
    )

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
    )

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "<b>Smart Face AI</b>",
            styles["Title"],
        )
    )

    elements.append(
        Paragraph(
            "Verification Logs Report",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    data = [[
        "ID",
        "User ID",
        "Status",
        "Confidence",
        "Camera",
        "Time (ms)",
    ]]

    for log in logs:

        data.append([
            str(log.id),
            str(log.user_id),
            log.status,
            str(log.confidence_score),
            str(log.camera_name),
            str(log.response_time_ms),
        ])

    table = Table(data)

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

            ("ALIGN", (0, 0), (-1, -1), "CENTER"),

            ("GRID", (0, 0), (-1, -1), 1, colors.black),

            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ])
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=verification_logs.pdf"
        },
    )