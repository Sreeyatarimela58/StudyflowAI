import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ECF95A',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#000000'
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#7B1E2B',
    paddingBottom: 4
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#4d4546'
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.5,
  }
});

const StudySessionDocument = ({ session }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{session.title || 'Study Summary'}</Text>
      
      <View>
        <Text style={styles.sectionTitle}>Summary</Text>
        {session.summary.split('\n').map((para, index) => (
          <Text key={index} style={styles.text}>{para}</Text>
        ))}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {session.recommendations?.map((rec, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{rec}</Text>
          </View>
        ))}
      </View>
      
      {session.flashcards?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Flashcards</Text>
          {session.flashcards.map((card, index) => (
            <Text key={index} style={styles.text}>
              Q: {card.front}{'\n'}A: {card.back}
            </Text>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const downloadPDF = async (session) => {
  const toastId = toast.loading('Generating PDF...');
  try {
    const blob = await pdf(<StudySessionDocument session={session} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title || 'Study_Summary'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('PDF downloaded successfully!', { id: toastId });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    toast.error('Failed to generate PDF', { id: toastId });
  }
};
