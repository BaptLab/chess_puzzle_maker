<?php
class Puzzle {
    public $puzzleId;
    public $fen;
    public $moves;
    public $rating;
    public $ratingDeviation;
    public $popularity;
    public $nbPlays;
    public $themes;
    public $gameUrl;
    public $openingTags;
    public $whosToMove; // New attribute

    // Constructor (optional) or add any getter/setter methods if needed

    // Optionally, you could create a method to map data from the database to this model
    public function __construct($data) {
        $this->puzzleId = $data['puzzle_id'];
        $this->fen = $data['fen'];
        $this->moves = $data['moves'];
        $this->rating = $data['rating'];
        $this->ratingDeviation = $data['rating_deviation'];
        $this->popularity = $data['popularity'];
        $this->nbPlays = $data['nb_plays'];
        $this->themes = $data['themes'];
        $this->gameUrl = $data['game_url'];
        $this->openingTags = $data['opening_tags'];
        $this->whosToMove = $data['whos_to_move']; // New attribute mapping
    }
}
