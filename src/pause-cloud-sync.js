// Registrato al volo solo durante un ripristino, poi subito rimosso.
//
// Il gioco valuta CLOUD_SYNC_PAUSED una volta sola, quando il suo bundle viene
// eseguito, leggendo window.__pokeCloudPause. Per questo lo script deve girare
// a document_start e nel mondo MAIN: se arrivasse dopo, il gioco avrebbe gia'
// scaricato il salvataggio dal server e sovrascritto quello ripristinato.
window.__pokeCloudPause = true;
