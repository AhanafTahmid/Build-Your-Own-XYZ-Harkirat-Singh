import Puzzle from 'crypto-puzzle';

async function main() {
    const puzzle = await Puzzle.generate({
        opsPerSecond: 3_300_000,
        duration: 5_000, 
        message: 'What is 2 + 2'
    });

    const solution = await Puzzle.solve ( puzzle );

    // About 10 seconds later...

    console.log ( solution );
}

main();