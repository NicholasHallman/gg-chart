import { html, LitElement } from "lit";


class ChartChanger extends LitElement {

  static get properties() {
    return {
      data: { attribute: false }
    };
  }

  constructor() {
    super();
    this.data = [0, 0, 1, 3, 10, 22, 53, 38, 27, 15];
  }

  render() {
    setTimeout(() => {
      this.data = this.data.map((d) => {
        const change = Math.floor((Math.random() * 7)) - 3;
        if(d === 0 && change < 0) return d;
        const nd = d + change;
        if (nd < 0) return 0;
        return nd;
      });
    }, 400)

    const chart = JSON.stringify({
      header: "Student Grades",
      width: "500",
      height: "300"
    });
    const axis = JSON.stringify({
      xTitle: "Grades",
      yTitle: "Number of Students",
      yTicks: 10,
      yMin: 0,
      yMax: 54
    });
    const column = JSON.stringify({
      data: this.data
    });
    const categories = JSON.stringify({
      labels: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"]
    });

    const handlePointClick = ({detail: {x, y}}) => console.log("Clicked a point", x, y);

    return html`
      <bar-chart
          @composite-chart-point-click="${handlePointClick}"
          debug
          chart='${chart}'
          axis='${axis}'
          column='${column}'
          categories='${categories}'
      >
      </bar-chart>
    `;
  }
}

customElements.define('chart-changer', ChartChanger);
