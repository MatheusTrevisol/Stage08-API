const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class MovieNotesController {
  async index(request, response) {
    const { user_id } = request.query;

    let notes;

    try {
      if(user_id) {
        notes = await knex("movie_tags")
          .select([
            "movie_notes.id",
            "movie_notes.title",
            "movie_notes.description",
            "movie_notes.rating",
            "movie_notes.user_id",
            "movie_tags.id as tag_id",
            "movie_tags.name as tag_name",
            "users.id",
            "users.name",
          ])
          .where("movie_notes.user_id", user_id)
          .where("movie_tags.user_id", user_id)
          .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
          .innerJoin("users", "users.id", "movie_tags.user_id")
          .orderBy("tag_name")
      } else {
        return e;
      }
    } catch(e) {
      throw new AppError("Você precisa informar o id do usuário")
    }

    return response.json(notes)
  }

  async show(request, response) {
    const { id } = request.params;

    let note;
    let tag;

    try {
     if(id) {
      note = await knex("movie_notes")
      .select([
        "users.id as user_id",
        "users.name as user_name",
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.rating"
      ])
      .where("movie_notes.id", id)
      .innerJoin("users", "users.id", "movie_notes.user_id")
      .orderBy("name").first();
    
      tag = await knex("movie_tags").where("note_id", id);
     } else {
      return e;
     }
    } catch(e) {
      throw new AppError("Informe o ID da nota por gentileza")
    }

    return response.json({
      ...note,
      tag
    })
  }

  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;
    
    let arrayOfRating = [1, 2, 3, 4, 5]
    let checkRatingNumber;

    arrayOfRating.forEach(number => {
      if(rating == number) {
        checkRatingNumber = true;
      }
    });

    try {
      if(checkRatingNumber) {
        const [movieNote] = await knex("movie_notes").insert({
          title,
          description,
          rating,
          user_id
        });

        if(tags) {
          const moviesTags = [
            "",
            "Ação",
            "Animação",
            "Aventura",
            "Biografia",
            "Comédia",
            "Crime",
            "Documentário",
            "Drama",
            "Esporte",
            "Família",
            "Fantasia",
            "Faroeste",
            "Ficção Científica",
            "Guerra",
            "História",
            "Mistério",
            "Musical",
            "Romance",
            "Suspense",
            "Terror",
            "Thriller"
          ]
          
          const tagsToInsert = tags.map(tag => {
            if(moviesTags.indexOf(tag) !== -1) {
              return {
                note_id: movieNote,
                user_id,
                name: tag
              }
            }
          })
    
          for(let i = 0; i < tagsToInsert.length; i++) {
            if(tagsToInsert[i] !== undefined) {
              await knex("movie_tags").insert(tagsToInsert[i]);
            } 
          }
        }
      } else {
        return e;
      }
    } catch(e) {
      throw new AppError("Você precisa informar uma rating numérica entre 1 e 5");
    }
    
    response.json();
  }

  async update(request, response) {
    const { title, description, rating } = request.body;
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();

    let arrayOfRating = [1, 2, 3, 4, 5]
    let checkRatingNumber;
    let updateRating;

    arrayOfRating.forEach(number => {
      if(rating == number) {
        checkRatingNumber = true;
      }
    });

    if(checkRatingNumber) {
      updateRating = rating;
    }

    note.title = title ?? note.title;
    note.description = description ?? note.description;
    note.rating = updateRating ?? note.rating;

    await knex("movie_notes").update({
      title: note.title,
      description: note.description,
      rating: note.rating
    }).where({ id });
   
    return response.json(note);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }
}

module.exports = MovieNotesController;