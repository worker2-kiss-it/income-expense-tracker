"""Seed database with realistic Austrian bookkeeping sample data."""
import asyncio
from datetime import date
from sqlalchemy import select
from .database import engine, async_session, Base
from .models.entry import Category, Project, Entry, EntryType, entry_projects

CATEGORIES = [
    "Büro", "Reise", "Marketing", "Software", "Personal",
    "Recht & Beratung", "Versicherung", "Telekommunikation",
    "Miete", "Sonstiges",
]

PROJECTS = ["DeFi", "Könyvelés", "Consulting", "SaaS"]

SEED_ENTRIES = [
    # 2024 entries - realistic Austrian Einnahmen-Ausgaben-Rechnung
    (date(2024, 1, 5), "Webentwicklung Projekt Alpha", 4500, "Einnahme", None, "Consulting", "Rechnung #2024-001"),
    (date(2024, 1, 10), "Büromaterial Amazon", 89.90, "Ausgabe", "Büro", None, None),
    (date(2024, 1, 15), "Hetzner Server", 49.90, "Ausgabe", "Software", "SaaS", "Monatlich"),
    (date(2024, 1, 20), "DeFi Smart Contract Audit", 3200, "Einnahme", None, "DeFi", None),
    (date(2024, 1, 25), "Steuerberater Honorar Q4/2023", 850, "Ausgabe", "Recht & Beratung", "Könyvelés", None),
    (date(2024, 2, 1), "Google Ads Kampagne", 320, "Ausgabe", "Marketing", "SaaS", None),
    (date(2024, 2, 5), "Consulting Retainer Feb", 6000, "Einnahme", None, "Consulting", None),
    (date(2024, 2, 10), "Büromiete Feb", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 2, 15), "Zugticket Wien-Graz", 45.60, "Ausgabe", "Reise", "Consulting", None),
    (date(2024, 2, 20), "GitHub Enterprise", 21, "Ausgabe", "Software", None, "Jährlich anteilig"),
    (date(2024, 3, 1), "DeFi Protocol Integration", 8500, "Einnahme", None, "DeFi", "Milestone 1"),
    (date(2024, 3, 5), "Rechtsanwalt Vertragsprüfung", 480, "Ausgabe", "Recht & Beratung", None, None),
    (date(2024, 3, 10), "Büromiete März", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 3, 15), "A1 Telekommunikation", 39.90, "Ausgabe", "Telekommunikation", None, None),
    (date(2024, 3, 20), "SVS Quartalsbeitrag", 1800, "Ausgabe", "Versicherung", None, "Q1/2024"),
    (date(2024, 4, 1), "SaaS Subscription Revenue", 2400, "Einnahme", None, "SaaS", "März Auszahlung"),
    (date(2024, 4, 5), "Flug Wien-Berlin Konferenz", 189, "Ausgabe", "Reise", None, None),
    (date(2024, 4, 10), "Hotel Berlin 2 Nächte", 320, "Ausgabe", "Reise", None, None),
    (date(2024, 4, 15), "Büromiete April", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 4, 20), "Figma Pro Plan", 15, "Ausgabe", "Software", None, None),
    (date(2024, 5, 1), "Consulting Projekt Beta", 7200, "Einnahme", None, "Consulting", "Rechnung #2024-012"),
    (date(2024, 5, 5), "LinkedIn Premium", 29.99, "Ausgabe", "Marketing", None, None),
    (date(2024, 5, 10), "Büromiete Mai", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 5, 15), "Druckkosten Visitenkarten", 65, "Ausgabe", "Büro", None, None),
    (date(2024, 5, 20), "DeFi Yield Farming Beratung", 1500, "Einnahme", None, "DeFi", None),
    (date(2024, 6, 1), "SaaS Subscription Revenue", 2800, "Einnahme", None, "SaaS", "Mai Auszahlung"),
    (date(2024, 6, 5), "Steuerberater Honorar Q1/2024", 850, "Ausgabe", "Recht & Beratung", "Könyvelés", None),
    (date(2024, 6, 10), "Büromiete Juni", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 6, 15), "AWS Cloud Services", 124.50, "Ausgabe", "Software", "SaaS", None),
    (date(2024, 6, 20), "SVS Quartalsbeitrag", 1800, "Ausgabe", "Versicherung", None, "Q2/2024"),
    (date(2024, 7, 1), "DeFi Protocol V2 Launch", 12000, "Einnahme", None, "DeFi", "Major Release"),
    (date(2024, 7, 5), "Notebook Lenovo ThinkPad", 1299, "Ausgabe", "Büro", None, "Abschreibung 3J"),
    (date(2024, 7, 10), "Büromiete Juli", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 7, 15), "Google Workspace", 11.50, "Ausgabe", "Software", None, None),
    (date(2024, 7, 20), "Consulting Workshop Tag", 1800, "Einnahme", None, "Consulting", None),
    (date(2024, 8, 1), "Sommerurlaub - kein Einnahme", 0, "Einnahme", None, None, "Urlaubsmonat"),
    (date(2024, 8, 5), "Büromiete Aug", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 8, 10), "Hetzner Server", 49.90, "Ausgabe", "Software", "SaaS", None),
    (date(2024, 8, 15), "Sonstige Ausgabe Parkgebühr", 35, "Ausgabe", "Sonstiges", None, None),
    (date(2024, 9, 1), "Consulting Projekt Gamma", 5500, "Einnahme", None, "Consulting", None),
    (date(2024, 9, 5), "SaaS Subscription Revenue", 3100, "Einnahme", None, "SaaS", "Aug Auszahlung"),
    (date(2024, 9, 10), "Büromiete Sep", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 9, 15), "Steuerberater Honorar Q2/2024", 850, "Ausgabe", "Recht & Beratung", "Könyvelés", None),
    (date(2024, 9, 20), "SVS Quartalsbeitrag", 1800, "Ausgabe", "Versicherung", None, "Q3/2024"),
    (date(2024, 10, 1), "DeFi Tokenomics Beratung", 4000, "Einnahme", None, "DeFi", None),
    (date(2024, 10, 5), "Facebook Ads", 250, "Ausgabe", "Marketing", "SaaS", None),
    (date(2024, 10, 10), "Büromiete Okt", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 10, 15), "Zugticket Linz Meeting", 38.40, "Ausgabe", "Reise", "Consulting", None),
    (date(2024, 10, 20), "Personal - Freelancer", 2000, "Ausgabe", "Personal", "SaaS", None),
    (date(2024, 11, 1), "SaaS Subscription Revenue", 3500, "Einnahme", None, "SaaS", "Okt Auszahlung"),
    (date(2024, 11, 5), "Consulting Retainer Nov", 6000, "Einnahme", None, "Consulting", None),
    (date(2024, 11, 10), "Büromiete Nov", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 11, 15), "Vercel Pro", 20, "Ausgabe", "Software", "SaaS", None),
    (date(2024, 11, 20), "Weihnachtsgeschenke Kunden", 180, "Ausgabe", "Marketing", None, None),
    (date(2024, 12, 1), "DeFi Audit Abschluss", 6000, "Einnahme", None, "DeFi", "Final Payment"),
    (date(2024, 12, 5), "Büromiete Dez", 750, "Ausgabe", "Miete", None, None),
    (date(2024, 12, 10), "Steuerberater Jahresabschluss", 1200, "Ausgabe", "Recht & Beratung", "Könyvelés", None),
    (date(2024, 12, 15), "SVS Quartalsbeitrag", 1800, "Ausgabe", "Versicherung", None, "Q4/2024"),
    (date(2024, 12, 20), "A1 Telekommunikation Jahresabo", 468, "Ausgabe", "Telekommunikation", None, "12 Monate"),
    (date(2024, 12, 28), "SaaS Subscription Revenue", 3800, "Einnahme", None, "SaaS", "Nov+Dez"),
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Check if already seeded
        existing = (await session.execute(select(Entry))).scalars().first()
        if existing:
            print("Database already seeded, skipping.")
            return

        # Categories
        cat_map = {}
        for name in CATEGORIES:
            cat = Category(name=name)
            session.add(cat)
            await session.flush()
            cat_map[name] = cat.id

        # Projects
        proj_map = {}
        for name in PROJECTS:
            proj = Project(name=name)
            session.add(proj)
            await session.flush()
            proj_map[name] = proj.id

        # Entries
        for row in SEED_ENTRIES:
            d, desc, amount, etype, cat_name, proj_name, notes = row
            entry = Entry(
                date=d,
                description=desc,
                amount=amount,
                entry_type=EntryType(etype),
                category_id=cat_map.get(cat_name),
                notes=notes,
            )
            if proj_name and proj_name in proj_map:
                proj = await session.get(Project, proj_map[proj_name])
                entry.projects = [proj]
            session.add(entry)

        await session.commit()
        print(f"Seeded {len(SEED_ENTRIES)} entries, {len(CATEGORIES)} categories, {len(PROJECTS)} projects.")


if __name__ == "__main__":
    asyncio.run(seed())
