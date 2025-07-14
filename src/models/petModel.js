class Pet {
    constructor(
        id,
        name,
        type,
        superPower,
        adoptedBy = null,
        adoptionHistory = [],
        status = 'available',
        // Nuevos atributos para cuidado tipo Pou
        health = 100, // barra de vida (0-100)
        happiness = 100, // barra de felicidad (0-100)
        personality = 'neutral', // personalidad: 'juguetón', 'perezoso', 'travieso', etc.
        activityHistory = [], // historial de actividades (alimentar, pasear, etc.)
        customization = { free: [], paid: [] }, // objetos de customización
        diseases = [], // enfermedades activas
        lastCare = null, // timestamp del último cuidado
        deathDate = null // fecha de muerte
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.superPower = superPower;
        this.adoptedBy = adoptedBy;
        this.adoptionHistory = adoptionHistory;
        this.status = status;
        // Nuevos atributos
        this.health = health;
        this.happiness = happiness;
        this.personality = personality;
        this.activityHistory = activityHistory;
        this.customization = customization;
        this.diseases = diseases;
        this.lastCare = lastCare;
        this.deathDate = deathDate;
    }
}

export default Pet; 