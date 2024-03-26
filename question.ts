import readline, { Interface } from "readline";
/**
 * readline wrapper
 * https://nodejs.org/docs/latest-v14.x/api/readline.html#readline_rl_question_query_options_callback
 */
export class Question {
  private readonly rl: Interface;
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  ask(prompt: string) {
    return new Promise<string>((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }
  close() {
    this.rl.close();
  }
}
