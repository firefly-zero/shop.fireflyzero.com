import { FunctionComponent } from "preact";
import { api } from "../api";

/** Guess the preferred currency based on the browser timeone.
 *
 * The list is imperfect and incomplete. The added items are added quite randomly.
 * If an item is missing, it's not a political decision.
 * Please, feel free to contribute more.
 *
 * Countries using euro are omitted because euro is the default website currency anyway.
 *
 * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
function detectCurrency(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.startsWith("America/")) {
    return "USD";
  }
  if (tz.startsWith("Australia/")) {
    return "AUD";
  }
  switch (tz) {
    case "Africa/Cairo":
      return "EGP";
    case "Asia/Hong_Kong":
      return "HKD";
    case "Europe/Bucharest":
      return "RON";
    case "Europe/London":
      return "GBP";
    // Russia has a lot more timezones but it's not important
    // since we're not going to sell in Russia yet.
    case "Europe/Moscow":
      return "RUB";
    case "Europe/Minsk":
      return "BYN";
    case "Europe/Kyiv":
      return "UAH";
    default:
      return "USD";
  }
}

interface Props {
  children: number;
}

export const Price: FunctionComponent<Props> = (props) => {
  const rates = api.get("/rates");

  const currency = detectCurrency();
  const eur = props.children / 100;
  if (!rates.data || currency == "EUR") {
    return <>€{eur}</>;
  }
  const rate = rates.data.attributes[currency];
  const converted = (eur * rate).toFixed(2);
  return <abbr title={`about ${converted} ${currency}`}>€{eur}</abbr>;
};
