import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatClockOffset, formatDuration, sumDurationMinutes } from "../../lib/duration";
import {
  getCategory,
  getMeetingObjective,
  isObjectiveNa,
} from "../../lib/objectives";
import type { AgendaBlock, Meeting } from "../../types/meeting";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#141311",
    backgroundColor: "#fffef9",
  },
  kicker: {
    fontSize: 9,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "#c45c26",
    marginBottom: 8,
  },
  title: { fontSize: 24, fontFamily: "Times-Bold", marginBottom: 8 },
  muted: { color: "#6b6459", marginBottom: 4 },
  section: { marginTop: 22 },
  heading: { fontSize: 13, fontFamily: "Times-Bold", marginBottom: 8 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e6e1d6",
    paddingVertical: 8,
  },
  time: { width: 72, color: "#6b6459" },
  blockBody: { flex: 1 },
  blockTitle: { fontFamily: "Times-Bold", marginBottom: 2 },
  chip: { marginRight: 8, marginBottom: 4 },
});

export function PreReadDocument({
  meeting,
  blocks,
}: {
  meeting: Meeting;
  blocks: AgendaBlock[];
}) {
  const actual = sumDurationMinutes(blocks);
  let offset = 0;

  return (
    <Document title={`${meeting.title} pre-read`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.kicker}>Blackhatter meeting pre-read</Text>
        <Text style={styles.title}>{meeting.title || "Untitled meeting"}</Text>
        {meeting.scheduledAt ? (
          <Text style={styles.muted}>{meeting.scheduledAt.toLocaleString()}</Text>
        ) : (
          <Text style={styles.muted}>Date not set</Text>
        )}
        <Text style={styles.muted}>
          Duration {formatDuration(actual)}
          {meeting.targetDurationMinutes
            ? ` · Target ${formatDuration(meeting.targetDurationMinutes)}`
            : ""}
        </Text>
        {meeting.description ? (
          <Text style={{ marginTop: 12, lineHeight: 1.45 }}>
            {meeting.description}
          </Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.heading}>Objectives</Text>
          {meeting.objectives.length === 0 ? (
            <Text style={styles.muted}>No objectives selected.</Text>
          ) : (
            meeting.objectives.map((objective) => {
              const category = getCategory(objective.categoryId);
              return (
                <Text key={objective.id} style={styles.chip}>
                  • {objective.title}
                  {category ? ` — ${category.label}` : ""}
                </Text>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Agenda</Text>
          {blocks.length === 0 ? (
            <Text style={styles.muted}>No agenda blocks yet.</Text>
          ) : (
            blocks.map((block) => {
              const start = offset;
              offset += block.durationMinutes;
              return (
                <View key={block.id} style={styles.row} wrap={false}>
                  <Text style={styles.time}>{formatClockOffset(start)}</Text>
                  <View style={styles.blockBody}>
                    <Text style={styles.blockTitle}>
                      {block.title || "Untitled block"} ({formatDuration(block.durationMinutes)})
                    </Text>
                    {block.description ? <Text>{block.description}</Text> : null}
                    <Text style={styles.muted}>
                      Objective:{" "}
                      {isObjectiveNa(block.objectiveId)
                        ? "N/A"
                        : getMeetingObjective(
                            meeting.objectives,
                            block.objectiveId,
                          )?.title ?? "Unassigned"}
                    </Text>
                    {block.docLinks
                      .filter((link) => link.url)
                      .map((link, index) => (
                        <Text key={`${block.id}-link-${index}`}>
                          {link.label || link.url}: {link.url}
                        </Text>
                      ))}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </Page>
    </Document>
  );
}
