class Pet {
    constructor(id, name, type, superPower, adoptedBy = null, adoptionHistory = [], status = 'available') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.superPower = superPower;
        this.adoptedBy = adoptedBy; // id del héroe que la adoptó (actual)
        this.adoptionHistory = adoptionHistory; // historial de adopciones
        this.status = status; // 'available', 'adopted', 'returned'
    }
}

export default Pet; 