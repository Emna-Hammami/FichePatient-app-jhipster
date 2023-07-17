package com.fiche.patient.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Medecin.
 */
@Entity
@Table(name = "medecin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Medecin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom_med", nullable = false)
    private String nomMed;

    @NotNull
    @Column(name = "adresse", nullable = false)
    private String adresse;

    @NotNull
    @Column(name = "tel", nullable = false)
    private Integer tel;

    @Column(name = "fax")
    private Integer fax;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Medecin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomMed() {
        return this.nomMed;
    }

    public Medecin nomMed(String nomMed) {
        this.setNomMed(nomMed);
        return this;
    }

    public void setNomMed(String nomMed) {
        this.nomMed = nomMed;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Medecin adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Integer getTel() {
        return this.tel;
    }

    public Medecin tel(Integer tel) {
        this.setTel(tel);
        return this;
    }

    public void setTel(Integer tel) {
        this.tel = tel;
    }

    public Integer getFax() {
        return this.fax;
    }

    public Medecin fax(Integer fax) {
        this.setFax(fax);
        return this;
    }

    public void setFax(Integer fax) {
        this.fax = fax;
    }

    public String getEmail() {
        return this.email;
    }

    public Medecin email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUrl() {
        return this.url;
    }

    public Medecin url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Medecin)) {
            return false;
        }
        return id != null && id.equals(((Medecin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Medecin{" +
            "id=" + getId() +
            ", nomMed='" + getNomMed() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", tel=" + getTel() +
            ", fax=" + getFax() +
            ", email='" + getEmail() + "'" +
            ", url='" + getUrl() + "'" +
            "}";
    }
}
