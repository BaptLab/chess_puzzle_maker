package com.puzzleCraft.models;

import jakarta.persistence.*;

@Entity
@Table(name = "puzzle_craft_db") // Ensure the table name matches your database table
public class Puzzle {

	@Id
	@Column(name = "puzzle_id", nullable = false, unique = true)
	private String puzzleId; // Unique puzzle identifier

	@Column(name = "fen", nullable = false)
	private String fen; // FEN notation for the chess position

	@Column(name = "moves", nullable = false)
	private String moves; // Moves to solve the puzzle

	@Column(name = "rating", nullable = true)
	private Integer rating; // Puzzle difficulty rating

	@Column(name = "rating_deviation")
	private Integer ratingDeviation; // Rating deviation (if applicable)

	@Column(name = "popularity")
	private Integer popularity; // Popularity rating

	@Column(name = "nb_plays")
	private Integer nbPlays; // Number of times the puzzle has been played

	@Column(name = "themes")
	private String themes; // Themes associated with the puzzle

	@Column(name = "game_url")
	private String gameUrl; // URL link to the game on Lichess

	@Column(name = "opening_tags")
	private String openingTags; // Opening tags associated with the puzzleprivate String whosToMove;
	

	// Default constructor
	public Puzzle() {
		// No-argument constructor required by Hibernate
	}

	// Parameterized constructor (optional)
	public Puzzle(String puzzleId, String fen, String moves, Integer rating, Integer ratingDeviation,
			Integer popularity, Integer nbPlays, String themes, String gameUrl, String openingTags) {
		this.puzzleId = puzzleId;
		this.fen = fen;
		this.moves = moves;
		this.rating = rating;
		this.ratingDeviation = ratingDeviation;
		this.popularity = popularity;
		this.nbPlays = nbPlays;
		this.themes = themes;
		this.gameUrl = gameUrl;
		this.openingTags = openingTags;
	}

	public String getPuzzleId() {
		return puzzleId;
	}

	public void setPuzzleId(String puzzleId) {
		this.puzzleId = puzzleId;
	}

	public String getFen() {
		return fen;
	}

	public void setFen(String fen) {
		this.fen = fen;
	}

	public String getMoves() {
		return moves;
	}

	public void setMoves(String moves) {
		this.moves = moves;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public Integer getRatingDeviation() {
		return ratingDeviation;
	}

	public void setRatingDeviation(Integer ratingDeviation) {
		this.ratingDeviation = ratingDeviation;
	}

	public Integer getPopularity() {
		return popularity;
	}

	public void setPopularity(Integer popularity) {
		this.popularity = popularity;
	}

	public Integer getNbPlays() {
		return nbPlays;
	}

	public void setNbPlays(Integer nbPlays) {
		this.nbPlays = nbPlays;
	}

	public String getThemes() {
		return themes;
	}

	public void setThemes(String themes) {
		this.themes = themes;
	}

	public String getGameUrl() {
		return gameUrl;
	}

	public void setGameUrl(String gameUrl) {
		this.gameUrl = gameUrl;
	}

	public String getOpeningTags() {
		return openingTags;
	}

	public void setOpeningTags(String openingTags) {
		this.openingTags = openingTags;
	}

}
