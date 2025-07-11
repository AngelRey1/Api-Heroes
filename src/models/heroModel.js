class Hero {
    constructor(id, name, alias, city, team, pets = []) {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.city = city;
        this.team = team;
        this.pets = pets; // IDs de mascotas adoptadas
    }
}

export default Hero;
